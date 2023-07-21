import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
import { emailService } from "../external-service/email.service.js";
import { messageService } from "../external-service/phone.service.js";
import TicketDTO from "../dao/DTO/ticketDto.js";
import UserDTO from "../dao/DTO/userDto.js";
import { generateToken } from "../utils/middlewares/jwt.middleware.js";



export default class CartRepository {
    #service;
    #userService;
    #prodService;
    #ticketService;
    constructor(service, userService, prodService, ticketService) {
      this.#service = service;
      this.#userService=userService;
      this.#prodService=prodService;
      this.#ticketService=ticketService;
    }
    async getOneCart(req){
        const cid = req.params.cid;
        let response = await this.#service.getCartsById(cid);
        if(!response) response= await this.#service.create()
        response.products.forEach(element => {
            element.cid= cid;
        });
        return response
    }
    async putProdOfCart(req, res){
        const quantity=req.body.quantity;
        const user = await this.#userService.findByEmail(req.user.email);
        let cart;
        if(req.user.role==='premium'){
            const product = await this.#prodService.getProductsById(req.params.pid);
            if (product.owner===req.user.role) {
                throw CustomError.createError({
                    name:'Error al agregar productos',
                    cause:'No puede agregar productos propios al carrito',
                    message:'No puede agregar productos propios al carrito',
                    code: ErrorEnum.NO_AUTHORIZATION
                })
            }
        }
        if(user.cart.length>0){
            cart = await this.#service.addProductToCart(user.cart,quantity,req.params.pid);
        }else{
            cart = await this.#service.create(req.params.pid, quantity);
        }
        await this.#userService.updateCart(req.user.email,cart._id);
        const userUpdated = await this.#userService.findByEmail(req.user.email);
        const userDTO = new UserDTO(userUpdated);
        const token = generateToken(userDTO);
        res.cookie('AUTH',token,{
        maxAge:60*60*1000*24,
        httpOnly:true
        });
        return cart
    }
    async deleteProd(req ,res){
        await this.#service.deleteProduct(req.params.cid,req.params.pid);
        const userUpdated = await this.#userService.findByEmail(req.user.email);
        const userDTO = new UserDTO(userUpdated);
        const token = generateToken(userDTO);
        res.cookie('AUTH',token,{
        maxAge:60*60*1000*24,
        httpOnly:true
        });
        const response = await this.#service.getAll(); 
        return response
    }
    async deleteCart(req){
        await this.#service.deleteAllProducts(req.params.cid);
    }
    async ticketBuy(req, res){
        const cartResponse = await this.#service.getCartsById(req.params.cid);
        let amount= 0;
        for (let index = 0; index < cartResponse.products.length; index++) {
            const cartProd = cartResponse.products[index];
            const prodId= cartProd.product._id;
            const prodResponse= await this.#prodService.getProductsById(prodId);
            const stock = prodResponse.stock - cartProd.quantity;
            if(stock<0){
                CustomError.createError({
                    name:'Error en Stock',
                    cause:`El pedido supera al stock`,
                    message:`El stock es del libro ${prodResponse.title} es de ${cartProd.quantity}, no puede hacer un pedido mayor`,
                    code: ErrorEnum.INSUFICIENT_AMMOUNT
                })
            }
            if(stock===0){
                await this.#prodService.update(prodId,{status: false});
            }
            await this.#prodService.update(prodId,{stock: stock});
            amount+= Number(cartProd.product.price)*Number(cartProd.quantity);
            await this.#service.deleteProduct(req.params.cid,prodId)                     
        } 
        const user = await this.#userService.findByEmail(req.user.email);
        const date = new Date().toLocaleString();
        const finalTicket= new TicketDTO(amount, user.email,date)
        await this.#ticketService.ticketBuy(finalTicket)
        emailService.sendTicketEmail(user.email, finalTicket);
        if(user.phone){messageService.sendTicketMessage(user.phone)};
        const userDTO = new UserDTO(user);
        const token = generateToken(userDTO);
        res.cookie('AUTH',token,{
        maxAge:60*60*1000*24,
        httpOnly:true
        });
        return await this.#service.getCartsById(req.params.cid);
    }
}
import CustomError from "../../errors/custom.error.js";
import ErrorEnum from "../../errors/error.enum.js";
import { emailService } from "../../external-service/email.service.js";
import { messageService } from "../../external-service/phone.service.js";
import TicketDTO from "../DTO/ticketDto.js";


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
        const response = await this.#service.getCartsById(cid);
        response.products.forEach(element => {
            element.cid= cid;
        });
        return response
    }
    async putProdOfCart(req){
        const {quantity}=req.body;
        const user = await this.#userService.findByEmail(req.user.email);
        let cart;
        if(req.user.role==='premium'){
            const product = await this.#prodService.getProductsById(req.params.pid);
            if (product.owner===req.user.role) {
                throw CustomError.createError({
                    name:'Error al agregar productos',
                    cause:'No puede agregar productos propios al carrito',
                    message:'No puede agregar productos propios al carrito',
                    code: ErrorEnum.BODY_ERROR
                })
            }
        }
        if(user.cart){
            cart = await this.#service.addProductToCart(user.cart,quantity,req.params.pid);
        }else{
            cart = await this.#service.create(req.params.pid, quantity);
        }
        await this.#userService.updateCart(req.user.email,cart._id);
        return cart
    }
    async deleteProd(req){
        await this.#service.deleteProduct(req.params.cid,req.params.pid);
        const response = await this.#service.getAll(); 
        return response
    }
    async deleteCart(req){
        await this.#service.deleteAllProducts(req.params.cid);
    }
    async ticketBuy(req){
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
            }else{
                await this.#prodService.update(prodId,{stock: stock});
                amount+= Number(cartProd.product.price)*Number(cartProd.quantity);
                await this.#service.deleteProduct(req.params.cid,prodId)
            }                       
        } 
        const userEmail= req.user.email;
        const date = new Date().toLocaleString();
        const finalTicket= new TicketDTO(amount, userEmail,date)
        await this.#ticketService.ticketBuy(finalTicket)
        emailService.sendTicketEmail(userEmail, finalTicket);
        if(req.user.phone)messageService.sendTicketMessage(usuario.phone);
        return await this.#service.getCartsById(req.params.cid);
    }
}
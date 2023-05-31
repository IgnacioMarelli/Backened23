import CustomError from "../../errors/custom.error.js";
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
        if(!user){
            CustomError.createError({
                name: 'Error en el Usuario',
                cause: `${req.user.email}No se encuentra en la base de datos`,
                message: 'Usuario no encontrado',
                code: ErrorEnum.BODY_ERROR,
            })
        }
        let cart;
        if(user.cart){
            cart = await this.#service.addProductToCart(user.cart,quantity,req.params.pid);
        }else{
            cart = await this.#service.create(req.params.pid, quantity);
        }
        await this.#userService.updateCart(req.user.email,cart._id);
        return cart
    }
    async putCart(req){
        const {quantity}=req.body; 
        const user = this.#userService.findByEmail(req.user.email);
        if(user.cart){
            const cart = await this.#service.addProductToCart(req.params.cid,quantity,req.params.pid);
            return cart
        }
        const cartUser= this.#service.create(req.params.pid, quantity);
        return cartUser
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
                console.log(`No hay stock suficiente de ${prodResponse.title}`);
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
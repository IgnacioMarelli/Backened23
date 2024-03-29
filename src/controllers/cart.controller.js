import CartRepository from "../Service/cart.service.js";
import cartsService from "../dao/repository/cart.repository.js";
import userService from "../dao/repository/user.repository.js";
import prodService from "../dao/repository/prod.repository.js";
import ticketService from "../dao/repository/ticket.repository.js";

class cartsController {
    #dao;
    constructor(service){
        this.#dao=service;
    }
    async getOneCart(req, res, next){
        try {
            const user = req.user;
            const response = await this.#dao.getOneCart(req);
            res.status(200).render('cartId',{
                cart:response._id,
                response:response.products,
                user:user
            });
        } catch (error) {
            next(error)
        }
    }
    async putProdOfCart(req, res,next){
        try {
            const response = await this.#dao.putProdOfCart(req, res);
            res.status(200).send(response);    
        } catch (error) {
            next(error);
        }
    }
    async deleteProd(req, res, next){
        try {
            const response = await this.#dao.deleteProd(req, res);
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }     
    }
    async deleteCart(req, res, next){
        try {
            await this.#dao.deleteCart(req);
            res.status(200).send('Carrito eliminado')
        } catch (error) {
            next(error)
        }

    }
    async ticketBuy(req,res,next){
        try {
            const response = await this.#dao.ticketBuy(req, res);
            res.status(200).send(response);
        }catch (error) {
            next(error)
        }
    }
}
const cartController = new cartsController(new CartRepository(new cartsService(), new userService(), new prodService(), new ticketService()));
export default cartController
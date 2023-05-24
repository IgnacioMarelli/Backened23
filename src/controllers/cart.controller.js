import CartRepository from "../dao/repository/cart.repository.js";
import cartsService from "../services/cart.service.js";
import userService from "../services/user.service.js";
import prodService from "../services/prod.service.js";
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
                response:response.products,
                user:user
            });
        } catch (error) {
            next(error)
        }
    }
    async putProdOfCart(req, res,next){
        try {
            const response = await this.#dao.putProdOfCart(req);
            res.status(200).send(response);    
        } catch (error) {
            next(error);
        }
    }
    async putCart(req, res,next){
        try {
            const cart = await this.#dao.putCart(req);
            res.status(200).send(cart);    
        } catch (error) {
            next(error);
        }   
    }
    async deleteProd(req, res, next){
        try {
            const response = await this.#dao.deleteProd(req);
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }     
    }
    async deleteCart(req,res, next){
        await this.#dao.deleteCart(req);
    }
    async ticketBuy(req,res,next){
        try {
            await this.#dao.ticketBuy(req, res)
            res.status(200)
        }catch (error) {
            console.error(error);
            res.status(405).render('No puede hacer la compra');
        }
    }
}
const cartController = new cartsController(new CartRepository(new cartsService(), new userService(), new prodService()));
export default cartController
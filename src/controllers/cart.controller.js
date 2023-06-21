import CartRepository from "../dao/repository/cart.repository.js";
import cartsService from "../services/cart.service.js";
import userService from "../services/user.service.js";
import prodService from "../services/prod.service.js";
import ticketService from "../services/ticket.service.js";
import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
class cartsController {
    #dao;
    constructor(service){
        this.#dao=service;
    }
    async getOneCart(req, res, next){
        try {
            if(!req.user){
                throw CustomError.createError({
                    name:'Usuario no logueado',
                    cause:'No se logueó correctamente el usuario',
                    message:'Debe iniciar sesión nuevamente',
                    code:ErrorEnum.BODY_ERROR})
            }
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
            const response = await this.#dao.ticketBuy(req);
            res.status(200).send(response);
        }catch (error) {
            next(error)
        }
    }
}
const cartController = new cartsController(new CartRepository(new cartsService(), new userService(), new prodService(), new ticketService()));
export default cartController
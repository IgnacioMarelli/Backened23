import prodService from '../dao/repository/prod.repository.js';
import ProdsRepository from '../Service/prods.service.js';
class ProductController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async getAllProds(req,res,next){
        try {
            const response = await this.#service.getAllProds(req);
            const user = req.user;
            const cart = req.user.cart[0]?.products?.length === 0 ? null : req.user.cart[0]?._id ?? null;
            res.render('home',{
                products:response,
                pages: response.totalPages,
                page: response.page,
                prev: response.prevPage,
                next: response.nextPage,
                hasPrevPages: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                user:user,
                cart:cart
            });
        } catch (error) {
            next(error)
        }
    }
    async getOneProd(req,res,next){
        try {
            const product = await this.#service.getOneProd(req);
            const user = req.user;
            const cart = req.user.cart[0]._id;
            res.render('prod',{products: product, user:user, cart:cart});
        } catch (error) {
            next(error)
        }
    }
    async post(req,res,next){
        try {
            const prod = await this.#service.post(req, res)
            res.status(200).send(prod)
        }catch (error) {
            next(error)
        }
    
    }
    async deleteProd(req,res,next){
        try {
            const eliminado = await this.#service.deleteProd(req);
            res.status(200).send(eliminado);
        } catch (error) {
            next(error);
        }
    } 
    async update(req, res, next){
        try {
            const response = await this.#service.update(req);
            res.status(200).send(response);

        } catch (error) {
            next(error)
        }
    }   
}
const prodController = new ProductController(new ProdsRepository(new prodService()));
export default prodController
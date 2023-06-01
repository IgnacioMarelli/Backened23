import prodService from '../services/prod.service.js';
import ProdsRepository from '../dao/repository/prods.repository.js';
class ProductController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async getAllProds(req,res,next){
        try {
            const response = await this.#service.getAllProds(req);
            const user = req.user;
            res.render('home',{
                products:response,
                pages: response.totalPages,
                page: response.page,
                prev: response.prevPage,
                next: response.nextPage,
                hasPrevPages: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                user:user,
            });
        } catch (error) {
            next(error)
        }
    }
    async getOneProd(req,res,next){
        try {
            const product = await this.#service.getOneProd(req);
            res.render('prod',{products: product});
        } catch (error) {
            next(error)
        }
    }
    async post(req,res,next){
        try {
            await this.#service.post(req, res)
            res.status(200)
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
            res.status(200).render(response);

        } catch (error) {
            next(error)
        }
    }   
}
const prodController = new ProductController(new ProdsRepository(new prodService()));
export default prodController
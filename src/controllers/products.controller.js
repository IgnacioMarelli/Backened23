import prodService from '../dao/Repository/prod.repository.js';
import ProdsRepository from '../Service/prods.service.js';
class ProductController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async getAllProds(req,res,next){
        try {
            const response = await this.#service.getAllProds(req);
            res.status(200).send(response);
        } catch (error) {
            next(error)
        }
    }
    async getOneProd(req,res,next){
        try {
            const response = await this.#service.getOneProd(req);
            res.status(200).send(response);
        } catch (error) {
            next(error)
        }
    }
    async post(req,res,next){
        try {
            const response = await this.#service.post(req, res)
            res.status(200).send(response);
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
import cartsService from "../services/cart.service.js";

class cartsController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async getOneCart(req, res, next){
        try {
            const cid = req.params.cid;
            const response = await this.#service.getCartsById(cid);
            response.products.forEach(element => {
                element.cid= cid;
            });
            res.status(200).render('cartId',{
                response:response.products
            });
        } catch (error) {
            next(error)
        }
    }
    async putProdOfCart(req, res,next){
        try {
            const {quantity}=req.body;
            const response = await this.#service.addProductToCart(req.params.cid, quantity, req.params.pid);
            res.status(200).send(resObject);    
        } catch (error) {
            next(error);
        }
    }
    async putCart(req, res,next){
        try {
            const {prod, quantity}=req.body;
            const cart = await this.#service.addProductToCart(req.params.cid,quantity,prod);
            res.status(200).send(cart);    
        } catch (error) {
            next(error);
        }   
    }
    async deleteProd(req, res, next){
        try {
            await this.#service.deleteProduct(req.params.cid,req.params.pid);
            const response = await this.#service.getAll();
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }     
    }
    async deleteCart(req,res, next){
        await this.#service.deleteAllProducts(req.params.cid);
    }
}
const cartController = new cartsController(new cartsService());
export default cartController
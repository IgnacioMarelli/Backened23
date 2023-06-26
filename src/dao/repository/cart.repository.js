import { cartModel } from "../models/carts.model.js";

class cartsService {
    #model
    constructor(){
        this.#model= cartModel;
    }
    async getAll(){
        const products = await this.#model.find().lean();
        return products     
    }
    async create(prod, quantity){
        try {
            const newCart= await this.#model.create({ products: { product: prod, quantity: quantity }});
            return newCart
        } catch (error) {
            console.error(error);
            throw new Error('NO se pudo crear carrito')
        }
        
    }
    async addProductToCart(cart, quantity, prod){
        if (quantity=== undefined) {
            quantity=1;
        }
        const isInCart = await this.#model.findOne({_id: cart,"products.product": prod});
        if(!isInCart){
            await this.#model.findOneAndUpdate({_id: cart}, {$push: {products: {product: prod, quantity:  quantity }}});
        }else{
            await this.#model.findOneAndUpdate({_id: cart, "products.product": prod}, {"products.$.quantity": quantity});
        }
        return await this.#model.findOne({_id: cart}).lean();
    }

    async addQuantity(cid, pid, qty){
        return await this.#model.findOneAndUpdate({_id: cid, "products.product": pid}, {$inc: {"products.$.quantity": qty}});
    }
    async deleteProduct(cid, pid){
        return await this.#model.findOneAndUpdate({_id: cid}, {$pull: {products: {product: pid}}})
    }

    async deleteAllProducts(cid){
        return await this.#model.findOneAndReplace({_id: cid}, {products: []});
    }
    async getCartsById(cid){
        const prodPorId= await this.#model.findOne({_id:cid}).lean();
        return prodPorId
    }
}
export default cartsService
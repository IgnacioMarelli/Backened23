import { cartModel } from "../dao/models/carts.model.js";


class cartsService {
    #model
    constructor(){
        this.#model= cartModel;
    }
    async getAll(){
        const products = await this.#model.find().lean();
        return products     
    }
    async addProductToCart(cart, quantity, prod){
        const carts = await this.getAll();
        if (cart=== 'undefined') {
            const newCart = carts.length=== 0 ? await this.#model.create({ products: { product: prod, quantity: quantity }}) : await this.model.findOne({});
            const newId = newCart._id;
            cart= newId.toString();
        }
        if (quantity=== undefined) {
            quantity=1;
        }
        if (quantity===0) {
            await deleteProduct(cart,prod);
        }else{
            const isInCart = await this.#model.findOne({_id: cart,"products.product": prod});

            if(!isInCart){
                await this.#model.findOneAndUpdate({_id: cart}, {$push: {products: {product: prod, quantity:  quantity }}});
            }else{
                await this.#model.findOneAndUpdate({_id: cart, "products.product": prod}, {"products.$.quantity": quantity});
            }
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
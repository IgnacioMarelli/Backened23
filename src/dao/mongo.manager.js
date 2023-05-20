import {messageModel} from './models/messages.model.js';
import {productModel} from './models/products.model.js';
import { cartModel } from './models/carts.model.js';
import { userModel } from './models/users.model.js';
class MongoManager{
    constructor(model){
        this.model =model;    
    }
    async getAll(){
        try{
            const products = await this.model.find().lean();
            return products
        }catch(e){
            console.error(e);
            throw e
        }           
    }
    async paginate({limit=10, page=1, sort, category, status}){
        const sortValidValues = [-1, 1, '-1', '1'];
        try{
            const query = category ? { category } : (status ? { status } : {});
            
            if(isNaN(limit) || limit <= 0){
                throw 'El limite debe ser mayor a 0'
            }

            if(isNaN(page)){
                throw 'Page no es un número';
            }
            
            if(sortValidValues.includes(sort)){
                return await productModel.paginate(query, {limit: limit, page: page, sort: { price: sort}, lean: true})
            }else{
                if(sort){
                    throw 'El valor del sort debe ser 1 o -1'
                }
            }
            return await this.model.paginate(query, {limit: limit || 10, page: page || 1, lean: true})
        }catch(e){
            console.error(e);
            throw e
        }           
     }

     async create(product){
        await this.model.create(product);
     }
     async getProductsById(id){
         const prodPorId= await this.model.findOne({_id: id}).lean();
         return prodPorId
     }
     async updateProduct(id, prod){
        return await this.model.findByIdAndUpdate(id, prod, { new: true })
     }
     async deleteById(id){
        return await this.model.findByIdAndDelete(id);
    }

/////////////////////////////////////////////////CART////////////////////////////////////////////////////////////////////////////////////////
    
    async addProductToCart(cart, quantity, prod){
        try{
        const carts = await this.getAll();
        if (cart=== 'undefined') {
            const newCart = carts.length=== 0 ? await this.model.create({ products: { product: prod, quantity: quantity }}) : await this.model.findOne({});
            const newId = newCart._id;
            cart= newId.toString();
        }
        if (quantity=== undefined) {
            quantity=1;
        }
        if (quantity===0) {
            await deleteProduct(cart,prod);
        }else{
            const isInCart = await this.model.findOne({_id: cart,"products.product": prod});

            if(!isInCart){
                await this.model.findOneAndUpdate({_id: cart}, {$push: {products: {product: prod, quantity:  quantity }}});
            }else{
                await this.model.findOneAndUpdate({_id: cart, "products.product": prod}, {"products.$.quantity": quantity});
            }
        }
        return await this.model.findOne({_id: cart}).lean();
        }catch(e){
            console.error(e);
        }   
    }

    async addQuantity(cid, pid, qty){
        return await this.model.findOneAndUpdate({_id: cid, "products.product": pid}, {$inc: {"products.$.quantity": qty}});
    }
    async deleteProduct(cid, pid){
        return await this.model.findOneAndUpdate({_id: cid}, {$pull: {products: {product: pid}}})
    }

    async deleteAllProducts(cid){
        return await this.model.findOneAndReplace({_id: cid}, {products: []});
    }
    async getCartsById(cid){
        const prodPorId= await this.model.findOne({_id:cid}).lean();
        return prodPorId
    }

 }
const instanceMessage = new MongoManager(messageModel);
const instanciaProduct = new MongoManager(productModel);
const instanceCarts= new MongoManager(cartModel);
const instanceUser = new MongoManager(userModel);
export {instanciaProduct, instanceMessage, instanceCarts, instanceUser};

 
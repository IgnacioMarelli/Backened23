import {messageModel} from './models/messages.model.js';
import {productModel} from './models/products.model.js';
import { cartModel } from './models/carts.model.js';
class MongoManager{
    constructor(model){
        this.model =model;    
    }
    async getAll(){
        try{
            const products = await this.model.find();
            return products.map((e)=>e.toObject())
        }catch(e){
            console.error(e);
            throw e
        }           
    }
    async getAllPaginate({limit=10, page=1, sort, category, status}){
        const sortValidValues = [-1, 1, '-1', '1'];
        try{
            let query = {};
            if(category){
                query = {category};
            }
            if(status){
                query ={status};
            }
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
        return product
     }
     async getProductsById(id){
         const prodPorId= await this.model.find({_id: id});
         const prodObj= prodPorId.map((e)=> e.toObject())
         return prodObj
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
            let newCart;
            if (carts.length===0) {
                newCart= await this.model.create({products:{product:prod, quantity: quantity}});
            }else{
                newCart= await this.model.findOne({})
            }
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
        return await this.model.findOne({_id: cart})     }catch(e){
            console.error(e);
            throw e;
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
        const prodPorId= await this.model.find({_id:cid});
        return prodPorId
    }
 }
const instanceMessage = new MongoManager(messageModel);
const instanciaProduct = new MongoManager(productModel);
const instanceCarts= new MongoManager(cartModel);
export {instanciaProduct, instanceMessage, instanceCarts};

 
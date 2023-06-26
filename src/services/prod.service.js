import { productModel } from "../dao/models/products.model.js";
import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";


class prodService {
    #model
    constructor(){
        this.#model= productModel;
    }
    async getAll(){
        try {
            const products = await this.#model.find().lean();
            return products  
        } catch (error) {
        CustomError.createError({
            name: 'Error en DB',
            cause: 'Modelo de productos mal utilizado',
            message:'Error al buscar productos',
            code: ErrorEnum.DATABASE_ERROR,
            })
        }
    }
    async create(data){
        await this.#model.create(data)
    }
    async paginate({limit=10, page=1, sort, category, status}){
        const sortValidValues = [-1, 1, '-1', '1'];
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
            return await this.#model.paginate(query, {limit: limit, page: page, sort: { price: sort}, lean: true})
        }else{
            if(sort){
                throw 'El valor del sort debe ser 1 o -1'
            }
        }
        return await this.#model.paginate(query, {limit: limit || 10, page: page || 1, lean: true})
    }
    async getProductsById(id){
        return this.#model.findOne({_id:id}).lean()
    }
    async update(id, data){
        return await this.#model.findByIdAndUpdate(id, data, { new: true })
    }
    async delete(id){
        return this.#model.findByIdAndDelete(id)
    }
    async updateCartProd(pid, qty){
        const prod= await this.#model.findOne({_id:pid}).lean();
        const finalStock = prod.stock-qty;
        await this.#model.updateOne({ _id: pid }, { $set: { stock: finalStock } });
        return await this.#model.findOne({_id:pid}).lean();
    }
}

export default prodService
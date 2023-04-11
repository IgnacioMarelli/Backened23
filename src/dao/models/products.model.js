import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const prodsCollection = 'products'

const prodsSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    price:{
        type:String,
        required: true
    },
    thumbnail:{
        type:Array,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    code:{
        type:String,
        required: true
    },
    stock:{
        type:String,
        required: true
    },
    status:{
        type:Boolean
    },
    category:{
        type:String,
        required: true
    } 
})

prodsSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(prodsCollection, prodsSchema);
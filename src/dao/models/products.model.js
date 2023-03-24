import mongoose from "mongoose";

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
        type:String
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


export const productModel = mongoose.model(prodsCollection, prodsSchema);
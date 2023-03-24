import mongoose from "mongoose";

const messagesCollection = 'products'

const messagesSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
   messages:{
    type: String,
    required:true
    }
})
export const messageModel = mongoose.model(messagesCollection, messagesSchema);
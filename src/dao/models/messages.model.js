import mongoose from "mongoose";

const messagesCollection = 'messages'

const messagesSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
   message:{
    type: String,
    default:''
    }
})
export const messageModel = mongoose.model(messagesCollection, messagesSchema);
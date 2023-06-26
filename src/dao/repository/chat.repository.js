import { messageModel } from "../models/messages.model.js";
export default class chatService {
    #model
    constructor(){
        this.#model= messageModel;
    }
    async getAll(){
        const response = await this.#model.find().lean();
        return response     
    }
    async create(data){
        return this.#model.create(data)
    }
}
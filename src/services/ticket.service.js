import { ticket } from "../dao/models/ticket.model.js";

export default class ticketService {
    #ticketModel
    constructor(){
        this.#ticketModel=ticket;
    }
    async ticketBuy(cart){
        const ticketBuy= await this.#ticketModel.create(cart)
        return ticketBuy
    }
}
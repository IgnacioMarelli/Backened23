import twilio from 'twilio'
import { config } from '../../data.js';

class MessageService{
    #client
    constructor(){
        this.#client=twilio(config.twilio.accountSid, config.twilio.authToken);
    }

    async sendWelcomeMessage(phoneNumber){
        this.#client.messages.create({
        from: config.twilio.phoneNumber,
        to: phoneNumber,
        body:'Bienvenido'
        })
    }
    async sendTicketMessage(phoneNumber){
        this.#client.messages.create({
        from: config.twilio.phoneNumber,
        to: phoneNumber,
        body:'Compra Realizada'
        })
    }
}
export const messageService = new MessageService();
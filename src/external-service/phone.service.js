import twilio from 'twilio'
import { config } from '../../data.js';

class MessageService{
    #client
    constructor(){
        this.#client=twilio(config.twilio.accountSid, config.twilio.authToken);
    }

    async sendWelcomeMessage(phoneNumber){
        try {
            this.#client.messages.create({
                from: config.twilio.phoneNumber,
                to: phoneNumber,
                body:'Bienvenido'
            })
        } catch (error) {
            throw new Error
        }

    }
    async sendTicketMessage(phoneNumber){
        try {
            this.#client.messages.create({
                from: config.twilio.phoneNumber,
                to: phoneNumber,
                body:'Compra Realizada'
            }) 
        } catch (error) {
            throw new Error
        }

    }
}
export const messageService = new MessageService();
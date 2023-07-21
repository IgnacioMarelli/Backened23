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
                to: +5492216078683,
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
                to: +542216078683,
                body:'Compra Realizada'
            }) 
        } catch (error) {
            throw new Error
        }

    }
}
export const messageService = new MessageService();
import { config } from '../../data.js';
import nodemailer from 'nodemailer'

class EmailService{
    #transporter;
    constructor(){
        this.#transporter = nodemailer.createTransport(config.mail);
    }
    async sendWelcomeEmail(email, user){
        await this.#transporter.sendMail({
            from: `"code"<${config.mail.auth.user}>`,
            to: email,
            subject:'Bienvenido',
            text:`Bienvenido a nuestra comunidad ${user.name}`,
        });
    }
    async sendTicketEmail(email,finalTicket){
        await this.#transporter.sendMail({
            from: `"code"<${config.mail.auth.user}>`,
            to:email,
            subject:'Compra Finalizada',
            text:`Has completado la compra de libros. Muchas gracias por confiar. Ticket ${finalTicket}`
        });
    }
}

export const emailService = new EmailService();
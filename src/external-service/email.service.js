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
            text:`Bienvenido a nuestra comunidad ${user.first_name}`,
        });
    }
    async sendDeleteEmail(email, user, prod){
        await this.#transporter.sendMail({
            from: `"code"<${config.mail.auth.user}>`,
            to: email,
            subject:'Se ha eliminado un producto suyo',
            text:`Hola, se ha eliminado el producto "${prod}"`,
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
    async restorPassByEmail(email, token){
        await this.#transporter.sendMail({
            from: `"code"<${config.mail.auth.user}>`,
            to:email,
            subject:'Restablecimiento de contraseña',
            html:`<h1>Has solicitado un cambio de contraseña. Has click en el siguiente boton para recuperarla: <a href="http://localhost:8080/api/users/newPass/${token}">Click aquí</a> </h1>`
        });
    }
}

export const emailService = new EmailService();
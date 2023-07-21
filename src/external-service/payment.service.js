import Stripe from "stripe";
import { config } from '../../data.js';
export default class PaymentService{
    #stripe;
    constructor(){
        this.#stripe=new Stripe(config.stripe_secret_key);
    }

    async createPaymentIntent(data){
        const paymentIntent = await this.#stripe.paymentIntents.create(data);
        return paymentIntent;
    }
}
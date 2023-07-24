import chatService from '../dao/repository/chat.repository.js';
import { chatRepository } from '../Service/chat.service.js';
class ChatController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async getAll(req,res,next){
        try {
            const user= req.user;
            const cart = req.user.cart[0]._id;
            res.render('chat',{
                user: user,
                cart:cart
            });
        } catch (error) {
            next(error)
        }
    }
}
const chatController = new ChatController(new chatRepository(new chatService()));
export default chatController
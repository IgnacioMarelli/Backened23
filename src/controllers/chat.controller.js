import chatService from '../services/chat.service.js';
import { chatRepository } from '../dao/repository/chat.repository.js';
class ChatController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async getAll(req,res,next){
        try {
            const user= req.user;
            res.render('chat',{
                user: user,
            });
        } catch (error) {
            next(error)
        }
    }
}
const chatController = new ChatController(new chatRepository(new chatService()));
export default chatController
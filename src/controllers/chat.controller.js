import chatService from '../dao/Repository/chat.repository.js';
import { chatRepository } from '../Service/chat.service.js';
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
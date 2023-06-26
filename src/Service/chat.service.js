import chatService from "../dao/Repository/chat.repository.js";
export class chatRepository {
    #dao;
    constructor(dao) {
      this.#dao = dao;
    }
  
    async getAll(){
        const response = await this.#dao.getAll();
        return response
    }
    async create(data){
        const response = await this.#dao.create(data);
        return response
    }
}
export const chatFunctions = new chatRepository(new chatService());
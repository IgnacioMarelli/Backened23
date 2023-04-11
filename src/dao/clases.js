import { productModel } from './models/products.model.js';
//import MongoManager from './mongo.manager.js';
import {messageModel} from './models/messages.model.js';

class Users {
  #persistencia;
  constructor(persistencia) {
    this.#persistencia = persistencia;
  }

  async getAll() {
    return await this.#persistencia.getAll();
  }

  async save(data) {
    return this.#persistencia.create(data);
  }
  async delete(id){
    return this.#persistencia.deleteById(id)
  }
}


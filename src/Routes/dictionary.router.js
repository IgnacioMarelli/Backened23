import express from 'express';

export class Router {
    #router;
    #path;
    constructor(path) {
      this.#router = express.Router();
      this.#path= path;
    }

    get path(){
        return this.#path;
    }
    get router(){
        return this.#router;
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
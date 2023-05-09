import { productModel } from '../dao/models/products.model.js';

class ProdService {
  #persistencia;
  constructor(persistencia) {
    this.#persistencia = persistencia;
  }

  async getAll() {
    return await this.#persistencia.getAllPaginate();
  }

  async save(data) {
    return this.#persistencia.create(data);
  }
  async getProductsById(id){
    return this.#persistencia.create(data);
  }
  async delete(id){
    return this.#persistencia.deleteById(id)
  }
}


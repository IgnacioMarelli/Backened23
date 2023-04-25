import express from 'express';
class UserRouter extends Router{
  constructor(){
    super('/path que sea');
  }
  init(){

  }
}
export class Router {
  /**
   * @type {express.Router}
   * @private
   */
    #router;
    /**
     * @type {string}
     * @private
     */
    #path;
    /**
     * @constructor
     * @param {string} path
     */
    constructor(path, option = {middlewares: []}) {
      /**@private */
      this.#router = express.Router();
      /**@private */
      /**@readonly */
      this.#path= path;
      this.#router.use(generateCustomResponse);
      middlewares.length > 0 && this.#router.use(middlewares)
      this.init();
    }
    /**
     * @method
     * @returns {void}
     */
    init(){}

    /**
     * @public
     * @readonly
     * @type {string}
     */
    get path(){
        return this.#path;
    }

    /**
     * @public
     * @readonly
     * @type {express.Router}
     */
    get router(){
        return this.#router;
    }
    /**
     * @public
     * @param {string} path 
     * @param  {...express.RequestHandler} callbacks 
     */

    get(path, ...callbacks){
      this.#router.get(path, ...callbacks)
    }
        /**
     * @public
     * @param {string} path 
     * @param  {...express.RequestHandler} callbacks 
     */
    post(path, ...callbacks){
      this.#router.get(path, ...callbacks)
    }
        /**
     * @public
     * @param {string} path 
     * @param  {...express.RequestHandler} callbacks 
     */
    put(path, ...callbacks){
      this.#router.get(path, ...callbacks)
    }
        /**
     * @public
     * @param {string} path 
     * @param  {...express.RequestHandler} callbacks 
     */
    delete(path, ...callbacks){
      this.#router.get(path, ...callbacks)
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

  function generateCustomResponse(req, res, next) {
    res.okResponse = (payload)=>{
        res.status(200).send({
        status: 'succes',
        payload,      
      });
    }
    res.serverError = (error)=>{
      res.status(500).send({
          stauts:'error',
          error,
      })
    }
    res.userError = (error)=>{
      res.status(400).send({
          stauts:'error',
          error,
      })
    }
    next()
  }


export default class CartRepository {
    #service;
    #userService;
    #prodService;
    constructor(service, userService, prodService) {
      this.#service = service;
      this.#userService=userService;
      this.#prodService=prodService;
    }
    async getOneCart(req){
        const cid = req.params.cid;
        const response = await this.#service.getCartsById(cid);
        response.products.forEach(element => {
            element.cid= cid;
        });
        return response
    }
    async putProdOfCart(req){
        const {quantity}=req.body;
        const response = await this.#service.addProductToCart(req.params.cid, quantity, req.params.pid);
        await this.#userService.updateCart(req.user.email,response._id);
        await this.#prodService.updateCartProd(req.params.pid, quantity);
        return response
    }
    async putCart(req){
        const {prod, quantity}=req.body; 
        const cart = await this.#service.addProductToCart(req.params.cid,quantity,prod);
        return cart
    }
    async deleteProd(req){
        await this.#service.deleteProduct(req.params.cid,req.params.pid);
        const response = await this.#service.getAll(); 
        return response
    }
    async deleteCart(req){
        await this.#service.deleteAllProducts(req.params.cid);
    }
    async ticketBuy(req){
        const cartResponse = await this.#service.getOneCart(req.params.cid);
        const prodResponse= await this.#userService.getAll()
        for (let index = 0; index < cartResponse.products.length; index++) {
            const element = cartResponse.products[index].quantity;
            if()
            
        } 
        await this.#service.ticketBuy(cartResponse)
        return cartResponse
    }
}
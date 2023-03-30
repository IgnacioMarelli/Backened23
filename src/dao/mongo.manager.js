
class MongoManager{
    constructor(model){
        this.model =model;    
    }
    async getAll(){
        try{
            const products = await this.model.find();
            return products
        }catch(e){
            console.error(e);
            throw e
        }           
     }

     async create(product){
        const total = await this.getAll();
        total.push(product);
        let id = 0;
        total.forEach(e => {
            id++;
            e.id= id;
        });
        await this.model.create(total);
        return product
     }
     async getProductsById(id){
         const total = await this.getProducts();
         const prodPorId= total.find( e => e.id === id);
         return prodPorId
     }
     async updateProduct(id, prod){
        return await this.model.findByIdAndUpdate(id, prod, { new: true })
     }
     async deleteById(id){
        return await this.model.findByIdAndDelete(id);
    }


    
    async getCart(){
        const isPath= fs.existsSync(this.path);
        if(!isPath){
            await fs.promises.writeFile(this.path, '[]');
         }            
         const resolve = await fs.promises.readFile(this.path, (err, data) => { if (err) throw err;});
         const cart = JSON.parse(resolve);
         const carts = await this.createCart(cart);
         return carts
    }
    async createCart(cart){

        if (cart.length===0){
            cart.push({id:1, products:[]});
            await fs.promises.writeFile(this.path, JSON.stringify(cart));
            return cart
        }
        const cartWId = await this.cartID(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(cartWId));
        return cartWId
    }

    async cartID(cartRandom){
        cartRandom.push({id:1, products:[]});
        for (let id = 0; id < cartRandom.length; id++) {
            cartRandom[id].id=id+1;
        }
        return cartRandom
    }

    async getProductsCartsById(id){
        const total = await this.getCart();
        const prodPorId= total.find( e => e.id === id);
        return prodPorId.products
    }
    async addProductToCart(cart, prod){
        const resolve = await fs.promises.readFile(this.path, (err, data) => { if (err) throw err;});
        const carts = JSON.parse(resolve);
        const cartId= carts.find( e => e.id === cart);
        const newProduct = {
            quantity: 1,
            product: prod.id,
        };
        const ssd= cartId.products;
        const xd = ssd.find(e=>e.product===newProduct.product)
        if (xd) {
            xd.quantity++;
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return cartId
        }
        cartId.products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return cartId
    }
 }
 
 
export default MongoManager;
 
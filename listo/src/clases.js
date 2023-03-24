import * as fs from 'fs';
class ProductManage{
    constructor(path){
        this.path =path;    
    }
    readFile(){
        try {
            const data = JSON.parse(fs.readFileSync(this.path));
            return data;
        } catch (error) {
            return []
        }
    }
    async getProducts(){ 
        const isPath= fs.existsSync(this.path);
        if(!isPath){
            await fs.promises.writeFile(this.path, '[]');
            return this.path;
         }       
         const resolve = await fs.promises.readFile(this.path, (err, data) => { if (err) throw err;});
         const products = JSON.parse(resolve);
         return products
     }
     async addProduct(product){
         const total = await this.getProducts();
         if (!total.includes(product)) {
             total.push(product);
             let id = 0;
             total.forEach(e => {
                 id++;
                 e.id= id;
             });
             await fs.promises.writeFile(this.path, JSON.stringify(total));
             return product.id
         }else{
             console.log('Error, producto ya agregado');
         }
     }
     async getProductsById(id){
         const total = await this.getProducts();
         const prodPorId= total.find( e => e.id === id);
         return prodPorId
     }
     async updateProduct(id, prod){
        const data = await this.getProducts();
        if (id <= 0 || id > data.length) {
			return {
				error: "El producto con el id especificado no ha sido encontrado.",
			};
		}
        prod.id = id;
        const previousProduct = data.splice(id - 1, 1, prod);
        await fs.promises.writeFile(this.path, JSON.stringify(data));
        return previousProduct
     }
     async deleteById(id){
        const resolve =  await fs.promises.readFile(this.path, (err, data) => { if (err) throw err;});
        const products = JSON.parse(resolve);
        const prods = products.filter(prod=> prod.id!== id);
        await fs.promises.writeFile(this.path, JSON.stringify(prods));
        return `Has eliminado el producto con id: ${id} de la lista`
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
 
 
export default ProductManage;
 
const fs = require('fs');
class ProductManage{
    constructor(path){
        this.path =path; 
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
             total.forEach(e => {
                 let id = 0;
                 id++;
                 e.id= id;
             });
             await fs.promises.writeFile(this.path, JSON.stringify(total));
         }else{
             console.log('Error, producto ya agregado');
         }
     }
     async getProductsById(id){
         const total = await this.getProducts();
         const prodPorId= total.find( e => e.id === id);
         return prodPorId
     }
 }
 const instance = new ProductManage('productos.json');
 
 const newProduct = {
     title: "producto prueba",
     description:"Este es un producto prueba",
     price:200,
     thumbnail:"Sin imagen",
     code: "abc123",
     stock:25
 }
 
 module.exports = {ProductManage};
 
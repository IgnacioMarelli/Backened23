const express = require('express');
const app = express();
const {ProductManage} = require('./entrega');
const instance = new ProductManage('productos.json');
app.use(express.urlencoded({extended:true}));

app.get('/products', async (req, res)=>{
   const productos = await instance.getProducts();  
   const query=req.query;
   const limit = query.limit;
   const limitParse= JSON.parse(limit);
   const productosLimitados = [];
   if (limit != undefined) {
    for (let index = 0; index < limitParse; index++) {
        productosLimitados.push(productos[index]);       
    }
       res.send(productosLimitados);
       return 
   }
   res.send(productos);
})
app.get('/products/:pid', async (req, res)=>{  
    const params = req.params;
    const pid = params.pid;
    const paramsParse = JSON.parse(pid);
    const prodId =  await instance.getProductsById(paramsParse);
    res.send(prodId); 
})


const PORT = 8080;
app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT}`))
const express = require('express');
const { Router }= express;
const {ProductManage} = require('../clases');
const instance = new ProductManage('./productos.json');
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/', async (req, res)=>{
    const productos = await instance.getProducts();  
    const query= req.query;
    const limit = Object.keys(query);
    const productosLimitados = [];
    if (limit != undefined) {
    const limitParse= JSON.parse(limit);
     for (let index = 0; index < limitParse; index++) {
         productosLimitados.push(productos[index]);       
     }
        res.send(productosLimitados);
        return 
    }
    res.send(productos);
 })
router.get('/:pid',  async (req, res)=>{  
    const params = req.params;
    const pid = params.pid;
    const paramsParse = JSON.parse(pid);
    const prodId =  await instance.getProductsById(paramsParse);
    res.send(prodId); 
})
router.post('/', async(req, res)=>{
    const { title, price, thumbnail, description, code, stock, status, category } = req.body
    if ( title && price && description && code && stock && category) {
        if (status === undefined) {
            status = true;
       }
        if (title === "" || price === "" || description ===""|| code === "" || stock ==="" || status ==="" || category ==="") {
            res.status(405).send("Falta completar alguno de los datos");
        }else{
            await instance.addProduct({ title, price, thumbnail, description, code, stock, status, category });
            const response = await instance.getProducts();
            res.status(200).send(response);
        }
    }else{
        res.status(405).send('No ingreso alguna de las características del objeto')
    }

})
router.put('/:pid', async(req, res)=>{
    const params = req.params;
    const pid = params.pid;
    const paramsParse = JSON.parse(pid);  
    const { title, price, thumbnail, description, code, stock, status, category } = req.body;
    const prod = { title, price, thumbnail, description, code, stock, status, category };
    const response = await instance.updateProduct(paramsParse, prod);
    res.status(200).send(response);

})
router.delete('/:pid', async (req, res)=>{
    const params = req.params;
    const pid = Number(params.pid);
    const eliminado = await instance.deleteById(pid);
    res.status(200).send(eliminado);
})

 module.exports = { router };
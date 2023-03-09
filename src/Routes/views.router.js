import express from 'express';
import { Router } from 'express';
import fileDirName from '../utils/fileDirName.js';
const { __dirname } = fileDirName(import.meta);
import ProductManage from '../../clases.js';
const instanceProd = new ProductManage('./products.json');
const instance = new ProductManage('./carts.json');
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const routerCart = Router();
routerCart.use(express.json());
routerCart.use(express.urlencoded({extended:true}));



router.get('/', async (req, res)=>{
    const productos = await instanceProd.getProducts();  
    const query= req.query;
    if (query === {}) {
        const limit = Object.keys(query);
        const productosLimitados = [];
        if (limit != undefined) {
            const limitParse= JSON.parse(limit);
         for (let index = 0; index < limitParse; index++) {
             productosLimitados.push(productos[index]);       
         }
            res.render('home', {productos:productosLimitados});
            return 
        }
    }
    res.render('home',{productos: productos});
 })
router.get('/:pid',  async (req, res)=>{  
    const params = req.params;
    const pid = params.pid;
    const paramsParse = JSON.parse(pid);
    const prodId =  await instanceProd.getProductsById(paramsParse);
    res.render(prodId); 
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
            await instanceProd.addProduct({ title, price, thumbnail, description, code, stock, status, category });
            const response = await instanceProd.getProducts();
            res.status(200).render( response);
        }
    }else{
        res.status(405).render('No ingreso alguna de las características del objeto')
    }

})
router.put('/:pid', async(req, res)=>{
    const params = req.params;
    const pid = params.pid;
    const paramsParse = JSON.parse(pid);  
    const { title, price, thumbnail, description, code, stock, status, category } = req.body;
    const prod = { title, price, thumbnail, description, code, stock, status, category };
    const response = await instanceProd.updateProduct(paramsParse, prod);
    if(response == error){
        res.status(400).render(response);
        return
    }
    res.status(200).render(response);

})
router.delete('/:pid', async (req, res)=>{
    const params = req.params;
    const pid = Number(params.pid);
    const eliminado = await instanceProd.deleteById(pid);
    res.status(200).render(eliminado);
})

routerCart.post('/',async (req, res)=>{
    const response = await instance.getCart();
    res.status(200).render(response);
})

routerCart.put('/:cid', async (req, res)=>{
    const params = req.params;
    const cid = params.cid;
    const paramsParse = JSON.parse(cid);
    const cart = await instance.getProductsCartsById(paramsParse);
    res.status(200).render(cart);

})

routerCart.post('/:cid/product/:pid', async (req, res)=>{
    const params = req.params;
    const cid = params.cid;
    const pid = params.pid;
    const paramsCidParse = JSON.parse(cid);
    const paramspidParse = JSON.parse(pid);
    const prod = await instance.getProductsById(paramspidParse);
    const cart = await instance.addProductToCart(paramsCidParse,prod);
    res.status(200).render(cart);
})



export  { router, routerCart };
import express from 'express';
import { Router } from 'express';
import fileDirName from '../utils/fileDirName.js';
const { __dirname } = fileDirName(import.meta);
import {instanciaProduct, instanceMessage} from '../dao/clases.js';
import { uploader } from '../utils/multer.js';
import ProductManage from '../dao/fileSistem.js'
const instance = new ProductManage('./carts.json');
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const routerCart = Router();
routerCart.use(express.json());
routerCart.use(express.urlencoded({extended:true}));
const routerSocket = Router();
routerSocket.use(express.json());
routerSocket.use(express.urlencoded({extended:true}));
const routerChat = Router();
routerChat.use(express.json());
routerChat.use(express.urlencoded({extended:true}));



router.get('/', async (req, res)=>{
    const productos = await instanciaProduct.getAll();  
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
    res.send({productos});
 })
router.get('/:pid',  async (req, res)=>{  
    const params = req.params;
    const pid = params.pid;
    const paramsParse = JSON.parse(pid);
    const prodId =  await instanceProd.getProductsById(paramsParse);
    res.send(prodId); 
})
router.post('/', async(req, res)=>{
    try {
        const newProduct = req.body;
        if (!total.includes(newProduct)) {
            await instanciaProduct.save(newProduct);
        }else{
            res.status(405).send('Error, producto ya agregado');
        }
        const response = await instanciaProduct.getAll();
        res.status(200).send( response);
    }catch (error) {
        console.error(error);
        res.status(405).render('No ingreso alguna de las características del objeto');
    }

})

/*
router.post('/realTimeProducts', async(req, res)=>{
    const data = req.body;
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

})*/

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
    const pid = params.pid;
    const eliminado = await instanciaProduct.delete(pid);
    res.status(200).send(eliminado);
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
routerSocket.get('/', async (req, res)=>{
    res.render('realTimeProducts');
 })
routerSocket.post('/',uploader.array('file', undefined), async (req, res)=>{
    try {
        const product = req.body;
        const img = req.files;
        const filenames = [];
        for(const key in img){
            if(img.hasOwnProperty(key)){
                const files = img[key];
                
                if(Array.isArray(files)){
                    files.forEach(file =>{
                        filenames.push(file.filename)
                    })
                }else{
                    filenames.push(files.filename)
                }
                
            }
        }
        const status = product.status;
        if(!status){
            product.status = 'true'
        }
        
        product.price = Number(product.price);
        product.stock = Number(product.stock);
        const total = await instanciaProduct.getAll();
        if (!total.includes(product)) {
            await instanciaProduct.save({...product, thumbnail: filenames});
        }else{
            res.status(405).send('Error, producto ya agregado');
        }
        const response = await instanciaProduct.getAll();
        res.status(200).send(response);
    }catch (error) {
        console.error(error);
        res.status(405).render('No ingreso alguna de las características del objeto');
    }
})
routerChat.get('/', async (req,res)=>{
    res.render('chat');
})

export  { router, routerCart, routerSocket, routerChat as routerHome };
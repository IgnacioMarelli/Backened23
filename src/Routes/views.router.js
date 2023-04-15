import express from 'express';
import { Router } from 'express';
import {instanciaProduct} from '../dao/mongo.manager.js';
import { uploader } from '../utils/multer.js';
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const routerSocket = Router();
routerSocket.use(express.json());
routerSocket.use(express.urlencoded({extended:true}));

router.get('/', async (req, res)=>{
    const {page, limit, sort, category, status} = req.query;
    const response = await instanciaProduct.getAllPaginate({page: page, limit: limit, sort: sort,category, status, lean: true});
    res.render('home',{
        products:response,
        pages: response.totalPages,
        page: response.page,
        prev: response.prevPage,
        next: response.nextPage,
        hasPrevPages: response.hasPrevPage,
        hasNextPage: response.hasNextPage
    });
})
router.get('/:pid', async (req, res)=>{
    const pid = req.params.pid;
    const response = await instanciaProduct.getProductsById(pid);
    const object = response.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {})
    const product = object.undefined;
    res.render('prod',{products: product});
})
router.post('/', uploader.array('file', undefined), async (req, res)=>{
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
            product.status = 'true';
        }
        const total = await instanciaProduct.getAll();
        if (!total.includes(product)) {
            await instanciaProduct.create({...product, thumbnail: filenames});
        }else{
            res.status(405).send('Error, producto ya agregado');
        }
        res.status(200)
    }catch (error) {
        console.error(error);
        res.status(405).render('No ingreso alguna de las características del objeto');
    }
})

/*router.put('/:pid', async(req, res)=>{
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

})*/

router.delete('/:pid', async (req, res)=>{
    const params = req.params;
    const pid = params.pid;
    const eliminado = await instanciaProduct.deleteById(pid);
    res.status(200).send(eliminado);
})

routerSocket.get('/', async (req, res)=>{
    const {page, limit, sort, category, status} = req.query;
    const response = await instanciaProduct.getAllPaginate({page: page, limit: limit, sort: sort,category, status, lean: true});
    res.render('home',{
        products:response,
        pages: response.totalPages,
        page: response.page,
        prev: response.prevPage,
        next: response.nextPage,
        hasPrevPages: response.hasPrevPage,
        hasNextPage: response.hasNextPage
    });
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
            product.status = 'true';
        }
        const total = await instanciaProduct.getAll();
        if (!total.includes(product)) {
            await instanciaProduct.save({...product, thumbnail: filenames});
        }else{
            res.status(405).send('Error, producto ya agregado');
        }
        res.status(200)
    }catch (error) {
        console.error(error);
        res.status(405).render('No ingreso alguna de las características del objeto');
    }
})


export  { router,routerSocket};
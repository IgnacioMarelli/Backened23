const express = require('express');
const { Router }= express;
const {ProductManage} = require('../clases');
const instance = new ProductManage('./carts.json');
const instanceProd = new ProductManage('./productos.json');
const routerCart = Router();
routerCart.use(express.json());
routerCart.use(express.urlencoded({extended:true}));


routerCart.post('/',async (req, res)=>{
        const response = await instance.getCart();
        res.status(200).send(response);
})

routerCart.put('/:cid', async (req, res)=>{
    const params = req.params;
    const cid = params.cid;
    const paramsParse = JSON.parse(cid);
    const cart = await instance.getProductsCartsById(paramsParse);
    res.status(200).send(cart);

})

routerCart.post('/:cid/product/:pid', async (req, res)=>{
    const params = req.params;
    const cid = params.cid;
    const pid = params.pid;
    const paramsCidParse = JSON.parse(cid);
    const paramspidParse = JSON.parse(pid);
    const prod = await instanceProd.getProductsById(paramspidParse);
    const cart = await instance.addProductToCart(paramsCidParse,prod);
    res.status(200).send(cart);
})






module.exports = { routerCart };
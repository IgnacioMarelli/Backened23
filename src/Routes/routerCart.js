import express from 'express';
import { Router } from 'express';
import {instanceCarts} from '../dao/mongo.manager.js';
const routerCart = Router();
routerCart.use(express.json());
routerCart.use(express.urlencoded({extended:true}));


routerCart.get('/:cid', async (req, res)=>{
    const cid = req.params.cid;
    const response = await instanceCarts.getCartsById(cid);
    const resProds=response[0].products;
    const products = resProds.toObject();
    products.forEach(element => {
        element.cid= cid;
    });
    res.status(200).render('cartId',{
        response:products
    });
})
routerCart.put('/:cid/products/:pid', async (req, res)=>{
    console.log(req.body);
    const params = req.params;
    const cid = params.cid;
    const pid = params.pid;
    const {quantity}=req.body;
    const response = await instanceCarts.addProductToCart(cid, quantity, pid);
    const resObject = response.toObject();
    res.status(200).send(resObject);
})

routerCart.put('/:cid', async (req, res)=>{
    const cid = req.params.cid;
    const {prod, quantity}=req.body;
    const cart = await instanceCarts.addProductToCart(cid,quantity,prod);
    res.status(200).send(cart);

})

routerCart.delete('/:cid/products/:pid', async (req, res)=>{
    const params = req.params;
    const cid = params.cid;
    const pid = params.pid;
    await instanceCarts.deleteProduct(cid,pid);
    const response = await instanceCarts.getAll();
    res.status(200).send(response);
})
routerCart.delete('/:cid', async (req,res)=>{
    const cid = req.params.cid;
    await instanceCarts.deleteAllProducts(cid);
})

export  {routerCart};
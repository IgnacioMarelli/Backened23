import express from 'express';
import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { passportCall } from '../utils/middlewares/authentication.js';
const routerCart = Router();
routerCart.use(express.json());
routerCart.use(express.urlencoded({extended:true}));


routerCart.get('/:cid',passportCall('jwt'), cartController.getOneCart.bind(cartController))
routerCart.put('/:cid/products/:pid',passportCall('jwt'), cartController.putProdOfCart.bind(cartController))
routerCart.delete('/:cid/products/:pid', passportCall('jwt'), cartController.deleteProd.bind(cartController))
routerCart.delete('/:cid', cartController.deleteCart.bind(cartController))
routerCart.post('/:cid/purchase', passportCall('jwt'),cartController.ticketBuy.bind(cartController))

export  {routerCart};
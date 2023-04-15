import express from 'express';
import { Router } from 'express';
const routerChat = Router();


routerChat.use(express.json());
routerChat.use(express.urlencoded({extended:true}));
routerChat.get('/', async (req,res)=>{
    res.render('chat');
})
export  {routerChat};
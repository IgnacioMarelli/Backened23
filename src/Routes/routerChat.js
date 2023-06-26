import express from 'express';
import { Router } from 'express';
import { passportCall } from '../utils/authentication.js';
import chatController from '../controllers/chat.controller.js';
const routerChat = Router();


routerChat.use(express.json());
routerChat.use(express.urlencoded({extended:true}));
routerChat.get('/',passportCall('jwt'),chatController.getAll.bind(chatController))
export  {routerChat};
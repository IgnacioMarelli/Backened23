import express from 'express';
import { Router } from 'express';
import prodController from '../controllers/products.controller.js';
import { uploader } from '../utils/multer.js';
import { passportCall } from '../utils/authentication.js';
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/', passportCall('jwt'), prodController.getAllProds.bind(prodController))
router.get('/:pid', prodController.getOneProd.bind(prodController))
router.post('/', uploader.array('file', undefined), prodController.post.bind(prodController))
router.delete('/:pid', prodController.deleteProd.bind(prodController))
router.put('/:pid', prodController.update.bind(prodController))


export  {router};
import express from 'express';
import { Router } from 'express';
import prodController from '../controllers/products.controller.js';
import { uploader } from '../utils/multer.js';
import { passportCall, authorization } from '../utils/authentication.js';
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/', passportCall('jwt'), prodController.getAllProds.bind(prodController))
router.get('/:pid', passportCall('jwt'),prodController.getOneProd.bind(prodController))
router.post('/', uploader.array('file', undefined), passportCall('jwt') ,authorization('admin'), prodController.post.bind(prodController))
router.delete('/:pid', passportCall('jwt') ,authorization('admin'),prodController.deleteProd.bind(prodController))
router.put('/:pid', passportCall('jwt') ,authorization('admin'), prodController.update.bind(prodController))


export  {router};
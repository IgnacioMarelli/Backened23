import express from 'express';
import { Router } from 'express';
import prodController from '../controllers/products.controller.js';
import { uploader } from '../utils/middlewares/multer.js';
import { passportCall, authorizationPremium } from '../utils/middlewares/authentication.js';
const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/', passportCall('jwt'), prodController.getAllProds.bind(prodController))
router.get('/:pid', passportCall('jwt'),prodController.getOneProd.bind(prodController))
router.post('/', uploader.array("fileProd", undefined), passportCall('jwt') ,authorizationPremium('admin'), prodController.post.bind(prodController))
router.delete('/:pid', passportCall('jwt') ,authorizationPremium('admin'),prodController.deleteProd.bind(prodController))
router.put('/:pid', passportCall('jwt') ,authorizationPremium('admin'), prodController.update.bind(prodController))


export  {router};
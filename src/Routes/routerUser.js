import { Router } from 'express';
const routerUser = Router();
import passport from 'passport';
import { passportCall, newPass } from '../utils/middlewares/authentication.js';
import userController from '../controllers/user.controller.js';


routerUser.post('/register', userController.postRegister.bind(userController));
routerUser.get('/current', passportCall('jwt'), userController.getProfile.bind(userController));
routerUser.post('/login', userController.postLogin.bind(userController));
routerUser.post('/auth/logout', userController.logout.bind(userController));
routerUser.put('/newPass',passportCall('jwt'), userController.newPass.bind(userController));
routerUser.put('/:idUser', userController.updateUser.bind(userController));
routerUser.delete('/:idUsuario', userController.deleteUser.bind(userController));
routerUser.post('/restorePassword',userController.postRestorePass.bind(userController));
routerUser.get('/premium/',passportCall('jwt'),userController.getPremium.bind(userController));
routerUser.post('/premium/:uid',passportCall('jwt'),userController.postPremium.bind(userController));
export  { routerUser};

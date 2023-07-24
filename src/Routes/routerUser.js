import { Router } from 'express';
const routerUser = Router();
import { passportCall, newPass, authorization } from '../utils/middlewares/authentication.js';
import { uploader } from '../utils/middlewares/multer.js';
import userController from '../controllers/user.controller.js';

routerUser.get('/', passportCall('jwt'), authorization('admin'),userController.getUsers.bind(userController))
routerUser.delete('/', passportCall('jwt'), authorization('admin'),userController.deleteUsers.bind(userController))
routerUser.get('/register', userController.getRegister.bind(userController));
routerUser.post('/register', userController.postRegister.bind(userController));
routerUser.get('/login', userController.getLogin.bind(userController));
routerUser.get('/current', passportCall('jwt'), userController.getProfile.bind(userController));
routerUser.post('/login', userController.postLogin.bind(userController));
routerUser.post('/auth/logout',passportCall('jwt'), userController.logout.bind(userController));
routerUser.put('/newPass',passportCall('jwt'), userController.newPass.bind(userController));
routerUser.put('/:idUser', userController.updateUser.bind(userController));
routerUser.delete('/:idUsuario', userController.deleteUser.bind(userController));
routerUser.get('/restorePassword',userController.getRestorePass.bind(userController) );
routerUser.post('/restorePassword',userController.postRestorePass.bind(userController));
routerUser.get('/newPass/:token', newPass() ,userController.getNewPass.bind(userController) );
routerUser.get('/premium/',passportCall('jwt'),userController.getPremium.bind(userController));
routerUser.post('/premium/:uid',passportCall('jwt'),userController.postPremium.bind(userController));
routerUser.get('/admin/',passportCall('jwt'), authorization('admin'), userController.getAdmin.bind(userController));
routerUser.post('/admin/:uid',passportCall('jwt'), authorization('admin'), userController.postAdmin.bind(userController));
routerUser.post('/:uid/documents', uploader.array("file", undefined), passportCall('jwt') , userController.postDocs.bind(userController))

export  { routerUser};

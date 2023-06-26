import { Router } from 'express';
const routerUser = Router();
import passport from 'passport';
import { passportCall, newPass } from '../utils/middlewares/authentication.js';
import userController from '../controllers/user.controller.js';


routerUser.get('/register', userController.getRegister.bind(userController));
routerUser.post('/register', userController.postRegister.bind(userController));
routerUser.get('/login', userController.getLogin.bind(userController));
routerUser.get('/current', passportCall('jwt'), userController.getProfile.bind(userController));
routerUser.post('/login', userController.postLogin.bind(userController));
routerUser.post('/auth/logout', userController.logout.bind(userController));
routerUser.put('/newPass',passportCall('jwt'), userController.newPass.bind(userController));
routerUser.put('/:idUser', userController.updateUser.bind(userController));
routerUser.delete('/:idUsuario', userController.deleteUser.bind(userController));
routerUser.get('/githubbutton', passport.authenticate('github', {scope: ['user:email']}), (req, res)=>{});
routerUser.get('/github', passport.authenticate('github', {failureRedirect: '/login'}), userController.github.bind(userController));
routerUser.get('/restorePassword',userController.getRestorePass.bind(userController) );
routerUser.post('/restorePassword',userController.postRestorePass.bind(userController));
routerUser.get('/newPass/:token', newPass() ,userController.getNewPass.bind(userController) );
routerUser.get('/premium/',passportCall('jwt'),userController.getPremium.bind(userController));
routerUser.post('/premium/:uid',passportCall('jwt'),userController.postPremium.bind(userController));
export  { routerUser};

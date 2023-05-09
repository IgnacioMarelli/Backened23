import { Router } from 'express';
const routerUser = Router();
import passport from 'passport';
import { passportCall } from '../utils/authentication.js';
import userController from '../controllers/user.controller.js';


routerUser.get('/register', userController.getRegister.bind(userController));
routerUser.post('/register', userController.postRegister.bind(userController));
routerUser.get('/login', userController.getLogin.bind(userController));
routerUser.get('/current', passportCall('jwt'), userController.getProfile.bind(userController));
routerUser.post('/login', userController.postLogin.bind(userController));
routerUser.post('/auth/logout', userController.logout.bind(userController));
routerUser.put('/:idUser', userController.updateUser.bind(userController));
routerUser.delete('/:idUsuario', userController.deleteUser.bind(userController));
routerUser.post('restore-password', userController.restorePass.bind(userController))
routerUser.get('restore-password', userController.restoreGet.bind(userController))
routerUser.get('/githubbutton', passport.authenticate('github', {scope: ['user:email']}), (req, res)=>{})
routerUser.get('/github', passport.authenticate('github', {failureRedirect: '/login'}), userController.github.bind(userController))
export  { routerUser};
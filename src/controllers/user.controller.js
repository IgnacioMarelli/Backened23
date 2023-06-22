import userService from "../services/user.service.js";
import UserRepository from "../dao/repository/user.repository.js";

class UsersController {
    #service 
    constructor(service){
        this.#service=service;
    }
    async getRegister (req, res, next){
        try {
        if (req.user) {
            res.redirect('/session/current')
            }
            res.render('register');
        } catch (error) {
            next(error)
        }
    }
    async postRegister (req, res, next){
        try {
            await this.#service.postRegister(req);
            res.status(201).redirect('/session/login');
        } catch (error) {
            next(error)
        }
    }
    async getLogin (req, res, next){
        try {
        if (req.user) {
            res.redirect('/session/current')
            }
            res.render('login');
        } catch (error) {
            next(error)
        }
    }
    async getProfile (req, res, next){
        try {
        const user = await this.#service.getUser(req);
        res.render('perfil', {
            nombre: user.first_name,
            apellido: user.last_name,
            edad: user.age,
            carrito: user.cart,
            email: user.email,
            user:user,
            phone:user.phone,
            response: user.cart
        });
        } catch (error) {
            next(error)
        }
    }
    async postLogin (req, res, next){
        try {
            const user = await this.#service.postLogin(req,res);
            res.send(user); 
        } catch (error) {
            next(error)
        }
    }
    async logout (req, res, next){
        try {
            res.clearCookie('AUTH')
            res.redirect('/session/login');
        } catch (error) {
            next(error)
        }
    }
    async updateUser (req, res, next){
        try {
            await this.#service.updateUser(req, res)
            res.send({ ok: true });
        } catch (error) {
            next(error)
        }
    }
    async deleteUser (req, res, next){
        try{
            await this.#service.deleteUser(req)
            res.send({ ok: true });
        }catch(error){
            next(error)
        }
    }

    async github (req, res, next){
        try{
            res.redirect('/session/current');
        }catch(error){
            next(error)
        }
    }
    async getNewPass(req, res, next){
        try {
            res.render('newPass', {
                userEmail: req.user
            });          
        } catch (error) {
            next(error)
        }
    }
    async postRestorePass (req, res, next){
        try {
           const user = await this.#service.postRestorePass(req, res);
           res.send(user); 
        } catch (error) {
            next(error)
        }
    }
    async getRestorePass(req, res, next){
        try {
            res.render('restorePassword'); 
        } catch (error) {
            next(error)
        }
    }
    async newPass(req, res, next){
        try {
            const newPass= await this.#service.newPass(req);
            res.send(newPass);
        } catch (error) {
            next(error)
        }
    }
    async getPremium(req, res, next){
        try {
            const user= await this.#service.getUser(req);
            res.render('premium',{
                role:user.role,
                userId: user.id.toString()
            })
        } catch (error) {
            next(error)
        }

    }
    async postPremium(req, res, next){
        try {
            await this.#service.newRole(req);
            res.status(200).send('Ok')
        } catch (error) {
            console.error(error);
            next(error)
        }

    }

}
const userController = new UsersController(new UserRepository(new userService()));
export default userController
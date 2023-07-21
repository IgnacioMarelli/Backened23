import userService from "../dao/Repository/user.repository.js";
import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
import UserRepository from "../Service/user.serivce.js";

class UsersController {
    #service 
    constructor(service){
        this.#service=service;
    }
    async getRegister (req, res, next){
        try {
        if (req.user) {
            res.redirect('/api/users/current')
            }
            res.render('register');
        } catch (error) {
            next(error)
        }
    }
    async postRegister (req, res, next){
        try {
            const response = await this.#service.postRegister(req);
            res.status(201).send(response);
            
        } catch (error) {
            next(error)
        }
    }
    async getLogin (req, res, next){
        try {
        if (req.user) {
            res.redirect('/api/users/current')
            }
            res.render('login');
        } catch (error) {
            next(error)
        }
    }
    async getProfile (req, res, next){
        try {
        const user = await this.#service.getUser(req);
        const cart = req.user.cart[0]._id;
        res.render('perfil', {
            nombre: user.first_name,
            apellido: user.last_name,
            edad: user.age,
            carrito: user.cart,
            email: user.email,
            user:user,
            cart: cart,
            phone:user.phone,
            userId:user.id.toString()
        });
        } catch (error) {
            next(error)
        }
    }
    async postLogin (req, res, next){
        try {
            const user = await this.#service.postLogin(req,res);
            res.status(200).send(user); 
        } catch (error) {
            next(error)
        }
    }
    async logout (req, res, next){
        try {
            await this.#service.updateUser(req)
            res.clearCookie('AUTH')
            res.redirect('/api/users/login');
        } catch (error) {
            next(error)
        }
    }
    async updateUser (req, res, next){
        try {
            await this.#service.updateUser(req)
            res.send({ ok: true });
        } catch (error) {
            next(error)
        }
    }
    async deleteUser (req, res, next){
        try{
            await this.#service.deleteUser(req)
            res.status(200).send('Eliminado');
        }catch(error){
            next(error)
        }
    }

    async github (req, res, next){
        try{
            res.redirect('/api/users/current');
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
            const cart = req.user.cart[0]._id;
            res.render('premium',{
                role:user.role,
                userId: user.id.toString(),
                user:user,
                cart: cart
            })
        } catch (error) {
            next(error)
        }

    }
    async postPremium(req, res, next){
        try {
            await this.#service.newRole(req, res, next);
            res.status(200).send('Ok')
        } catch (error) {
            next(error)
        }

    }
    async postDocs(req, res, next){
        try {
            const doc = await this.#service.postDocs(req)
            res.status(200).send(doc)
        } catch (error) {
            next(error)
        }
    }
    async getUsers(req,res, next){
        try {
            const response = await this.#service.getAllUsers();
            res.status(200).send(response)
        } catch (error) {
            next(error)
        }

    }
    async deleteUsers(req, res, next){
        try {
            await this.#service.deleteUsers();
            res.status(204).send('Eliminados')
        } catch (error) {
            next(error)
        }
    }
    async getAdmin(req, res,next){
        try {
            const user= req.user;
            const users = await this.#service.getAllUsers();
            const cart = req.user.cart[0]._id;
            res.render('admin',{
                userId: user.id.toString(),
                response: users,
                user:user,
                cart:cart
            })
        } catch (error) {
            throw CustomError.createError({
                name:'Error al renderizar',
                cause:'El error ocurrió al renderizar admin en handlebars',
                message:'Verifique que este bien la view de handlebars',
                code: ErrorEnum.ROUTING_ERROR
            })
        }
    }
    async postAdmin(){
        try {
            await this.#service.newRole(req, res, next);
            res.status(200).send('Ok')
        } catch (error) {
            next(error)
        }
    }

}
const userController = new UsersController(new UserRepository(new userService()));
export default userController
import userService from "../dao/Repository/user.repository.js";
import UserRepository from "../Service/user.serivce.js";

class UsersController {
    #service 
    constructor(service){
        this.#service=service;
    }
    async postRegister (req, res, next){
        try {
            const response = await this.#service.postRegister(req);
            res.status(201).send(response);
        } catch (error) {
            next(error)
        }
    }
    async getProfile (req, res, next){
        try {
        const response = await this.#service.getUser(req);
        res.status(200).send(response);
        } catch (error) {
            next(error)
        }
    }
    async postLogin (req, res, next){
        try {
            const response= await this.#service.postLogin(req,res);
            res.status(200).send(response);
        } catch (error) {
            next(error)
        }
    }
    async logout (req, res, next){
        try {
            res.clearCookie('AUTH')
        } catch (error) {
            next(error)
        }
    }
    async updateUser (req, res, next){
        try {
            const response=await this.#service.updateUser(req, res)
            res.status(200).send(response);
        } catch (error) {
            next(error)
        }
    }
    async deleteUser (req, res, next){
        try{
            const response=await this.#service.deleteUser(req)
            res.status(200).send(response);
        }catch(error){
            next(error)
        }
    }

    async postRestorePass (req, res, next){
        try {
           const response = await this.#service.postRestorePass(req, res);
           res.status(200).send(response);
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
            const response= await this.#service.getUser(req);
            res.status(200).send(response);
        } catch (error) {
            next(error)
        }

    }
    async postPremium(req, res, next){
        try {
            const response = await this.#service.newRole(req, res);
            res.status(200).send(response);
        } catch (error) {
            console.error(error);
            next(error)
        }

    }

}
const userController = new UsersController(new UserRepository(new userService()));
export default userController
import { createHash, isValidPassword } from "../utils/crypto.js";
import { generateToken } from '../utils/jwt.middlewar.js';
import userService from "../services/user.service.js";

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
            res.render('register', {
                style: 'style',
            });
        } catch (error) {
            next(error)
        }
    }
    async postRegister (req, res, next){
        const usuario = req.body;
        const hashedPassword =await createHash(req.body.password);
        if (usuario.email==='adminCoder@coder.com'&& usuario.password==='Cod3r123') {
          usuario.role='admin';
        }
        try {
            await this.#service.create(usuario, hashedPassword);
            res.status(201).redirect('/session/login');
        } catch (error) {
            next(error)
        }
    }
    async getLogin (req, res, next){
        try {
        if (req.cookies['AUTH']) {
            res.redirect('/session/current')
            }
            res.render('login');
        } catch (error) {
            next(error)
        }
    }
    async getProfile (req, res, next){
        try {
        const user = req.user._doc;

        res.render('perfil', {
            nombre: user.first_name,
            apellido: user.last_name,
            edad: user.age,
            carrito: user.cart,
            email: user.email,
            user:user,
        });
        } catch (error) {
            next(error)
        }
    }
    async postLogin (req, res, next){
        try {
            const { email, password } = req.body;
            const user = await this.#service.findOne(email );
            if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).send({
                error: 'email o contraseña incorrectos',
            }); 
            }
            const token = generateToken({...user, password: undefined});
            res.cookie('AUTH',token,{
            maxAge:60*60*1000*24,
            httpOnly:true
            });
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
        const idUser = req.params.idUser;
        try {
            const usuario = await this.#service.findById( idUser );
            if (!usuario) {
              res
                .status(404)
                .send({ error: `Usuario con id ${idUser} no encontrado` });
              return;
            }
            const nuevosDatos = req.body;
        
            await this.#service.updateUser(
              { _id: idUser },
              { ...usuario, ...nuevosDatos }
            );
            res.send({ ok: true });
        } catch (error) {
            next(error)
        }
    }
    async deleteUser (req, res, next){
        try{
            const idUsuario = req.params.idUsuario;
            await this.#service.deleteUser({ _id: idUsuario });
            res.send({ ok: true });
        }catch(error){
            next(error)
        }
    }
    async restorePass (req, res, next){
        try{
            const {email, newPassword}=req.body;
            const user = await this.#service.findOne({email});
            if(!user){
                res.status(404).send({error: 'No existe el usuario'});
                return
            }
            const hashedPassword = createHash(newPassword);
            await this.#service.updatePass({email}, {$set:{password:hashedPassword}});
            res.status(200).send({message:'Contraseña modificada'})
        }catch(error){
            next(error)
        }
    }
    async restoreGet (req, res, next){
        try{
            res.render('restorePassword')
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
}
const userController = new UsersController(new userService());
export default userController
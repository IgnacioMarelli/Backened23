import UserDTO from "../dao/DTO/userDto.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import { generateToken } from '../utils/middlewares/jwt.middleware.js';
import { emailService } from "../external-service/email.service.js";
import { messageService } from "../external-service/phone.service.js";
import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
import jwt  from "jsonwebtoken";
import config from "../../data.js";
const SECRET = config.SECRET;
export default class UserRepository {
  #dao;
  constructor(dao) {
    this.#dao = dao;
  }
async getUser(req){
    if (req.user) {
        const userEmail = req.user.email;
        const userFind = await this.#dao.findByEmail(userEmail);
        const user= new UserDTO(userFind);
        return user
    }
    throw CustomError.createError({
        name:'Usuario no logueado',
        cause:'No se logueó correctamente el usuario',
        message:'Debe iniciar sesión nuevamente',
        code:ErrorEnum.BODY_ERROR
    })

}
async postRegister (req){
    const usuario = req.body;
    const hashedPassword =await createHash(req.body.password);
    if (usuario.email==='adminCoder@coder.com'&& usuario.password==='Cod3r123') {
      usuario.role='admin';
    } 
    if(usuario.phone){messageService.sendWelcomeMessage(usuario.phone)}
    emailService.sendWelcomeEmail(usuario.email, usuario.first_name)
    try {
        await this.#dao.create(usuario, hashedPassword);
    } catch (error) {
        throw CustomError.createError({
            name:'Usuario ya registrado',
            cause:'El usuario con ese mail, ya se encuentra registrado',
            message:'El usuario con ese mail, ya se encuentra registrado',
            code:ErrorEnum.BODY_ERROR
        })
    }    
}

async postLogin (req, res){
    const { email, password } = req.body;
    if (!email || !password) {
        throw CustomError.createError({
            name:'Error en Login',
            cause:'Mail o Contraseña Incorrectos',
            message:'Revise haber puesto el mail y la contraseña correctamente',
            code: ErrorEnum.BODY_ERROR
        })
    }
    const user = await this.#dao.findByEmail(email);
    const valid = await isValidPassword(password, user.password)
    if (!user || !valid) {
        throw CustomError.createError({
            name:'Error en Login',
            cause:'Mail o Contraseña Incorrectos',
            message:'Revise haber puesto el mail y la contraseña correctamente',
            code: ErrorEnum.BODY_ERROR
        })
    }
    const userDTO = new UserDTO(user);
    const token = generateToken(userDTO);
    res.cookie('AUTH',token,{
    maxAge:60*60*1000*24,
    httpOnly:true
    });
    return userDTO
}
async updateUser (req){
    const idUser = req.params.idUser? req.params.idUser : req.user.id;
    const usuario = await this.#dao.findById( idUser );
    if (!usuario) {
        throw CustomError.createError({
            name: 'Error en Id',
            cause:`El usuario con id: ${idUser}, no se encuentra en la base de datos`,
            message:'Debe seleccionar un usuario existente',
            code: ErrorEnum.DATABASE_ERROR,
        })
    }
    const nuevosDatos = req.body==={}?req.body:{last_connection: new Date().toString()};
    await this.#dao.updateUser( idUser,usuario,nuevosDatos);
}
async deleteUser (req){
    const idUsuario = req.params.idUsuario;
    await this.#dao.deleteUser({ _id: idUsuario });
}
async postRestorePass (req, res){
    const {email} = req.body;
    const user= await this.#dao.findByEmail(email);
    if (user) {
        const token = jwt.sign({ email}, SECRET, { expiresIn: '1h' });
        emailService.restorPassByEmail(email, token);
        const userDto = new UserDTO(user);
        return userDto
    }else{
        throw  CustomError.createError({
        name:'Error en Mail',
        cause:`Mail no registrado`,
        message:`El  ${email}  no se encuentra registrado`,
        code: ErrorEnum.BODY_ERROR
        });    
    }
}
async newPass (req){
    const email = req.body.email;
    const user = await this.#dao.findByEmail(email);
    const newPass= req.body.newPass;
    const valid = await isValidPassword(newPass, user.password)
    if (valid) {
        throw CustomError.createError({
            name:'Error en la nueva contraseña',
            cause:'Utiliza la misma contraseña que antes',
            message:'Debe insertar una contraseña diferente a la anterior',
            code: ErrorEnum.BODY_ERROR
        })
        }
        const hashedPass= await createHash(newPass);
        await this.#dao.updatePass(user._id, hashedPass);
    const userDto = new UserDTO(user);
    return userDto
}
async newRole(req, res, next){
    try {
            const user = await this.#dao.findById(req.params.uid);        
            if(user.role==='premium'){
                await this.#dao.updateUser(req.params.uid, user, {role:'user'});
            }else{
                const identificacion = user.documents.find(e=>e.name === 'Identificacion');
                const domicilio = user.documents.find(e=>e.name === 'Comprobante de domicilio');
                const cuenta = user.documents.find(e=>e.name === 'Comprobante de estado de cuenta');
                if (identificacion && domicilio && cuenta) {
                await this.#dao.updateUser(req.params.uid, user, {role:'premium'});
                }else{
                throw CustomError.createError({
                    name:'Error al cambiar a premium',
                    cause:'No cuenta con Identificación, Comprobante de domicilio, Comprobante de estado de cuenta',
                    message:'Debe subir Identificación, Comprobante de domicilio, Comprobante de estado de cuenta',
                    code: ErrorEnum.BODY_ERROR
                })}
            }
            const userDto = new UserDTO(await this.#dao.findById(req.params.uid));
            const token = generateToken(userDto);
            res.cookie('AUTH',token,{
            maxAge:60*60*1000*24,
            httpOnly:true
            });


        } catch (error) {
            next(error)
        }
    }
    async postDocs(req){
        const user= this.#dao.findById(req.params.uid);
        const img = req.files;
        const filenames = [];
        const filePath= img[0].path;
        let filename= img[0].filename;
        for(const key in img){
            if(img.hasOwnProperty(key)){
                const files = img[key];
                
                if(Array.isArray(files)){
                    files.forEach(file =>{
                        filenames.push(file.filename)
                    })
                }else{
                    filenames.push(files.filename)
                }
                
            }
        }
        await this.#dao.addDoc(req.params.uid, filename, filePath);
    }
}
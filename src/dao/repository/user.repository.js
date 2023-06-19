import UserDTO from "../DTO/userDto.js";
import { createHash, isValidPassword } from "../../utils/crypto.js";
import { generateToken } from '../../utils/jwt.middlewar.js';
import { emailService } from "../../external-service/email.service.js";
import { messageService } from "../../external-service/phone.service.js";
import CustomError from "../../errors/custom.error.js";
import ErrorEnum from "../../errors/error.enum.js";
import jwt  from "jsonwebtoken";
import config from "../../../data.js";
const SECRET = config.SECRET;
export default class UserRepository {
  #dao;
  constructor(dao) {
    this.#dao = dao;
  }
async getUser(req){
    const userEmail = req.user.email;
    const userFind = await this.#dao.findByEmail(userEmail);
    const user= new UserDTO(userFind);
    return user
}
async postRegister (req){
    const usuario = req.body;
    const hashedPassword =await createHash(req.body.password);
    if (usuario.email==='adminCoder@coder.com'&& usuario.password==='Cod3r123') {
      usuario.role='admin';
    } 
    if(usuario.phone){messageService.sendWelcomeMessage(usuario.phone)}
    emailService.sendWelcomeEmail(usuario.email, usuario.first_name)
    await this.#dao.create(usuario, hashedPassword);
}

async postLogin (req, res){
    const { email, password } = req.body;
    const user = await this.#dao.findByEmail(email);
    if (!user || !isValidPassword(password, user.password)) {
        return res.status(401).send({
            error: 'email o contraseña incorrectos',
    }); 
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
    const idUser = req.params.idUser;
    const usuario = await this.#dao.findById( {idUser} );
    if (!usuario) {
        throw CustomError.createError({
            name: 'Error en Id',
            cause:`El usuario con id: ${idUser}, no se encuentra en la base de datos`,
            message:'Debe seleccionar un usuario existente',
            code: ErrorEnum.DATABASE_ERROR,
        })
    }
    const nuevosDatos = req.body;
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
    if (isValidPassword(newPass, user.password)) {
        throw CustomError.createError({
            name:'Error en la nueva contraseña',
            cause:'Utiliza la misma contraseña que antes',
            message:'Debe insertar una contraseña diferente a la anterior',
            code: ErrorEnum.BODY_ERROR
        })
        }
        const hashedPass= createHash(newPass);
        await this.#dao.updatePass(user._id, hashedPass);
    const userDto = new UserDTO(user);
    return userDto
}

}
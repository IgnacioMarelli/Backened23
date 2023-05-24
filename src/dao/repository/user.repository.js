import UserDTO from "../DTO/userDto.js";
import { createHash, isValidPassword } from "../../utils/crypto.js";
import { generateToken } from '../../utils/jwt.middlewar.js';
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
async updateUser (req, res){
    const idUser = req.params.idUser;
    const usuario = await this.#dao.findById( idUser );
    if (!usuario) {
        res
        .status(404)
        .send({ error: `Usuario con id ${idUser} no encontrado` });
        return;
    }
    const nuevosDatos = req.body;
    await this.#dao.updateUser(
        { _id: idUser },
        { ...usuario, ...nuevosDatos }
    );
}
async deleteUser (req){
    const idUsuario = req.params.idUsuario;
    await this.#dao.deleteUser({ _id: idUsuario });
}

}
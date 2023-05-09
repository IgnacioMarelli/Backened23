import { userModel } from "../dao/models/users.model.js";


class userService {
    #model
    constructor(){
        this.#model= userModel;
    }
    async findById(idUser){
        return  this.#model.findOne({ _id: idUser });
    }
    async create(user, hashedPassword){
        return this.#model.create({...user, password: hashedPassword});
    }
    async findOne(email){
        return this.#model.findOne({ email });
    }
    async updateUser(idUser, usuario, nuevosDatos){
        return this.#model.updateOne({ _id: idUser },{ ...usuario, ...nuevosDatos });
    }

    async deleteUser(idUsuario){
        return this.#model.findOneAndDelete({_id:idUsuario})
    }
    async updatePass(email, hashedPassword){
        return  this.#model.updateOne({email}, {$set:{password:hashedPassword}});
    }
}
export default userService
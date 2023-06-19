import { userModel } from "../dao/models/users.model.js";


class userService {
    #model
    constructor(){
        this.#model= userModel;
    }
    async findByEmail(userEmail){
        return  this.#model.findOne({ email: userEmail }).lean();
    }
    async findById(id){
        return  this.#model.findOne({ _id: id }).lean();
    }
    async create(user, hashedPassword){
        return this.#model.create({...user, password: hashedPassword});
    }
    async updateUser(idUser, usuario, nuevosDatos){
        return this.#model.updateOne({ _id: idUser },{ ...usuario, ...nuevosDatos });
    }
    async updateCart(email, cid){
        return this.#model.updateOne({email},{$set:{cart:cid}});
    }
    async deleteUser(idUsuario){
        return this.#model.findOneAndDelete({_id:idUsuario})
    }
    async updatePass(email, hashedPassword){
        return  this.#model.updateOne({email}, {$set:{password:hashedPassword}});
    }
}
export default userService
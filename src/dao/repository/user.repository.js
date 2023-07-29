import { userModel } from "../models/users.model.js";


class userService {
    #model
    constructor(){
        this.#model= userModel;
    }
    async getAll(){
        return await this.#model.find().lean();
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
    async updateCart(email, data){
        return this.#model.updateOne({email},{$set:data});
    }
    async deleteUser(idUser){
        return this.#model.findOneAndDelete({_id:idUser})
    }
    async addDoc(id, filename, filePath ){
        return await this.#model.findOneAndUpdate({_id: id}, {$push: {documents: {name:filename, reference:filePath}}})
    }
    async deleteUsers(twoDaysAgo){
        return await this.#model.deleteMany({last_connection: {$lt: twoDaysAgo}})
    }
}
export default userService
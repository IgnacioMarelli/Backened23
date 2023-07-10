import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";

export default class ProdsRepository {
    #dao;
    constructor(dao) {
      this.#dao = dao;
    }
  
    async getAllProds(req){
        const {page, limit, sort, category, status} = req.query;
        const response = await this.#dao.paginate({page: page, limit: limit, sort: sort,category, status, lean: true});
        return response
    }
    async getOneProd(req){
        const product = await this.#dao.getProductsById(req.params.pid);
        return product
    }
    async post(req, res){
        try {
            const product = req.body;
            const img = req.files;
            const filenames = [];
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
            const keyWithEmptyValue = Object.entries(product).find(([key, value]) => value === "");
            if(keyWithEmptyValue){
                CustomError.createError({
                    name: 'Error en formulario',
                    cause:`El campo ${keyWithEmptyValue[0]} está vacío`,
                    message:'Rellene todos los campos porfavor',
                    code: ErrorEnum.BODY_ERROR
                })
            }
            const status = product.status;
            if(!status){
                product.status = 'true';
            }
            if(!req.user){
                throw CustomError.createError({
                    name:'Usuario no logueado',
                    cause:'No se logueó correctamente el usuario',
                    message:'Debe iniciar sesión nuevamente',
                    code:ErrorEnum.BODY_ERROR})
            }
            product.owner=req.user.email;
            const total = await this.#dao.getAll();
            const includes= total.find((e)=> e.title===product.title)
            if (!includes) {
                const prod = await this.#dao.create({...product, thumbnail: filenames});
                console.log(prod);
                return prod
            }else{
                CustomError.createError({
                    name: 'Error en formulario',
                    cause:`El libro ${product.title} ya se encuentra en la colección`,
                    message:'Intente con otro producto',
                    code: ErrorEnum.BODY_ERROR
                })
            }
        }catch (error) {
            throw CustomError.createError({
                name:'Problema en el dao',
                cause:'Hay un error al crear el producto',
                message:'Debe revisar la utilización de mongoose, o el modelo',
                code: ErrorEnum.DATABASE_ERROR
            })
        }
    }
    async deleteProd(req){
        const pid = req.params.pid;
        if(req.user.role=== 'premium'){
            const prod = await this.#dao.getProductsById(pid);
            if (prod.owner===req.user.email) {
                await this.#dao.delete(pid);
                return 'Se elimino el producto'
            }
            throw CustomError.createError({
                name:'No esta autorizado a eliminar producto',
                cause:'No tiene rol de admin, sino de premium',
                message:'Solo puede eliminar productos subidos por si mismo',
                code: ErrorEnum.BODY_ERROR
            })
        }
        const eliminado = await this.#dao.delete(pid);
        return 'Se elimino el producto'
    } 
    async update(req){
        const pid = req.params.pid; 
        const data = req.body;
        const response = await this.#dao.update(pid, data);
        return response
    }   
}

import CustomError from '../../errors/custom.error.js';
import ErrorEnum from '../../errors/error.enum.js'
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
    async post(req, next){
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
            if (keyWithEmptyValue) {
                CustomError.createError({
                    name: 'Faltan datos',
                    cause: `No se completo el campo ${keyWithEmptyValue[0]}`,
                    message: 'No se completo el formulario',
                    code: ErrorEnum.BODY_ERROR,
                })
            }
            
            const status = product.status;
            if(!status){
                product.status = 'true';
            }
            const total = await this.#dao.getAll();
            const includes= total.find(e=>e.title===product.title)
            if (includes) {
                CustomError.createError({
                    name: 'Producto ya agregado',
                    cause: `${product} ya se encuentra dentro de la colleción de productos`,
                    message: 'Producto ya agregado',
                    code: ErrorEnum.BODY_ERROR,
                })
            }
            await this.#dao.create({...product, thumbnail: filenames});
        } catch (error) {
            next(error)
        }
    }
    async deleteProd(req){
        const params = req.params;
        const pid = params.pid;
        const eliminado = await this.#dao.deleteById(pid);
        return eliminado
    } 
    async update(req){
        const pid = req.params.pid; 
        const prod = req.body;
        const response = await this.#dao.updateProduct(pid, prod);
        return response
    }   
}

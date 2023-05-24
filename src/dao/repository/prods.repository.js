
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
        const status = product.status;
        if(!status){
            product.status = 'true';
        }
        const total = await this.#dao.getAll();
        if (!total.includes(product)) {
            await this.#dao.create({...product, thumbnail: filenames});
        }else{
            res.status(405).send('Error, producto ya agregado');
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

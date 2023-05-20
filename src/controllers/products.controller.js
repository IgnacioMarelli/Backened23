import prodService from '../services/prod.service.js';

class ProductController {
    #service;
    constructor(service){
        this.#service=service;
    }
    async getAllProds(req,res,next){
        try {
            const user = req.user;
            const {page, limit, sort, category, status} = req.query;
            const response = await this.#service.paginate({page: page, limit: limit, sort: sort,category, status, lean: true});
            res.render('home',{
                products:response,
                pages: response.totalPages,
                page: response.page,
                prev: response.prevPage,
                next: response.nextPage,
                hasPrevPages: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                user:user,
            });
        } catch (error) {
            next(error)
        }
    }
    async getOneProd(req,res,next){
        try {
            const product = await this.#service.getProductsById(req.params.pid);
            res.render('prod',{products: product});
        } catch (error) {
            next(error)
        }
    }
    async post(req,res,next){
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
            const status = product.status;
            if(!status){
                product.status = 'true';
            }
            const total = await this.#service.getAll();
            if (!total.includes(product)) {
                await this.#service.create({...product, thumbnail: filenames});
            }else{
                res.status(405).send('Error, producto ya agregado');
            }
            res.status(200)
        }catch (error) {
            console.error(error);
            res.status(405).render('No ingreso alguna de las características del objeto');
        }
    
    }
    async deleteProd(req,res,next){
        try {
            const params = req.params;
            const pid = params.pid;
            const eliminado = await this.#service.deleteById(pid);
            res.status(200).send(eliminado);
        } catch (error) {
            next(error);
        }
    } 
    async update(req, res, next){
        try {
            const pid = req.params.pid; 
            const prod = req.body;
            const response = await this.#service.updateProduct(paramsParse, prod);
            res.status(200).render(response);

        } catch (error) {
            next(error)
        }
    }   
}
const prodController = new ProductController(new prodService());
export default prodController
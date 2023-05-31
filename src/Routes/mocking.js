import { Router } from "express";
import { faker } from '@faker-js/faker'
import ErrorEnum from "../errors/error.enum.js";
import CustomError from "../errors/custom.error.js";

const routeMocking = Router();

routeMocking.get('/', (req, res) =>{
    try {
        const products = [];
        for(let i = 0 ; i < 100; i++){
            const title = faker.commerce.product(); 
            const price = faker.commerce.price();
            const description = faker.commerce.productDescription();
            const code = Math.floor(Math.random() * 5);
            const stock = Math.floor(Math.random() * 20);
            const category = faker.commerce.department();
            const data = {
                title,
                price,
                description,
                code,
                stock,
                category,
                thumbnail:[]
            }
            products.push(data)
        }
        res.send({status: 'sucess', payload: products})
    } catch (error) {
        CustomError.createError({
            name: 'Error en el Body',
            cause: products.error.errors,
            message: JSON.stringify(products.error.errors.map(e => ({
                property: e.path.join('.'),
                issue: e.message,
            }))),
            code: ErrorEnum.BODY_ERROR,
            })
    }
});


export default routeMocking
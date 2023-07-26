import * as path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
const swaggerOptions ={
    definition:{
        openapi:'3.0.1',
        info:{
            title:'Ecommerce API',
            version:'1.0.0',
            description:'Ecommerce Api Information'
        },
    },
    servers:[
        {
            url:"https://backened23-production.up.railway.app/",
            description:"Servidor productivo", 
        },
        {
            url:"http://localhost:8080/",
            description:"Servidor local"
        }
    ],
    apis:[path.resolve('./src/docs/**/*.yaml')],
}

const spec = swaggerJSDoc(swaggerOptions);
export default spec
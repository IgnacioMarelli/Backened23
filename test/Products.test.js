import supertest from 'supertest';
import {expect} from 'chai';
import mongoose from 'mongoose';
import config from '../data.js';
describe('ProductController', () => {
    const requester = supertest('http://localhost:8080/api');
    let cookie;
    let id;
    describe('Test de endpoints de productos', ()=>{
        before(async function () {
            await mongoose.connect(config.MONGO_URL_TEST,{
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
            await mongoose.connection.db.collection('products').deleteMany({});
          });
        it('Debe renderizar todos los productos', async () => {
            const resLog= await requester
            .post("/session/login")
            .send({ email:'hio@hohtml.cpm', password: 'testpass' });
            const cookieresult = resLog.headers["set-cookie"][0];
            cookie = {
              name: cookieresult.split("=")[0],
              value: cookieresult.split("=")[1].split(";")[0],
            };
            const res = await requester
            .get('/products')
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(res.status).to.equal(200);
            expect(res.ok).to.be.true;
        });
        it('Debe crear un producto', async () => {
            const newProduct= {
                title: 'Product 1',
                price: 10.99,
                description: 'This is product 1',
                thumbnail:[],
                code:'34r5',
                stock:958,
                category:'TERROR'
            } 
            const res = await requester
            .post('/products')
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            .field('title', newProduct.title)
            .field('price', newProduct.price)
            .field('description', newProduct.description)
            .field('code', newProduct.code)
            .field('stock', newProduct.stock)
            .field('category', newProduct.category)
            .attach('file', './test/sfdsdfss.jpg')
            expect(res.body.title).to.deep.equal('Product 1')
            expect(res.body.price).to.deep.equal('10.99')
            expect(res.body.description).to.deep.equal('This is product 1')
            expect(res.body.thumbnail).to.deep.equal([ 'sfdsdfss.jpg' ])
            expect(res.status).to.equal(200);
            id = res.body._id
        });
        it('Debe renderizar un solo producto', async () => {
            const res = await requester
            .get(`/products/${id}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });
        it('debe actualizar a un producto', async () => {
            const res = await requester
                .put(`/products/${id}`)
                .set('Cookie', [`${cookie.name}=${cookie.value}`])
                .send({
                    title: 'Product 2',
                });
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.title).to.equal('Product 2');
        });
        it('debe borrra un producto', async () => {
            const res = await requester
            .delete(`/products/${id}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });

    })
});
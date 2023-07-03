import supertest from 'supertest';
import {expect} from 'chai';
import mongoose from 'mongoose';

describe('ProductController', () => {
    const requester = supertest('http://localhost:8080/api')
    describe('Test de endpoints de productos', ()=>{
        beforeEach(async function () {
            const connection = await mongoose.connect('mongodb://localhost:27017/test');
            await mongoose.connection.db.collection('products').deleteMany({});
        })
        it('Debe devolver todos los productos', async () => {
            const res = await requester.get('/products');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
        it('Debe devolver un solo producto', async () => {
            const res = await requester.get('/products/1');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });
        it('Debe crear un producto', async () => {
            const res = await requester
                .post('/products')
                .send({
                    title: 'Product 1',
                    price: 10.99,
                    description: 'This is product 1',
                    thumbnail:[],
                    code:'34r5',
                    stock:958,
                    category:'TERROR'
                });
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.equal('Product 1');
        });
        it('should delete a product', async () => {
            const res = await requester.delete('/products/1');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });
        it('should update a product', async () => {
            const res = await requester
                .put('/products/1')
                .send({
                    title: 'Product 2',
                    price: 10.99,
                    description: 'This is product 1',
                    thumbnail:[],
                    code:'34r5',
                    stock:958,
                    category:'TERROR'
                });
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.equal('Product 2');
        });

    })
});
describe('Test de uploads', ()=>{
    it('Debe poder subir una imagen', async ()=>{
        const prod = {
            title: 'Product 1',
            price: 10.99,
            description: 'This is product 1',
            thumbnail:[],
            code:'34r5',
            stock:958,
            category:'TERROR'
        };
        const {ok, _body} = await requester
        
        .post('/api/products')
            .field('title', prod.title)
            .field('title', prod.title)
            .field('title', prod.title)
            .field('title', prod.title)
            .field('title', prod.title)
            .field('title', prod.title)
            .attach('image','./test/test.jpg')
        expect(ok).to.be.true;
        expect(_body).to.have.property('payload');
        expect(_body.payload).to.have.property('image');
        expect(_body.payload).to.have.property('_id');
    })
})



describe('ProductController with views', () => {
    describe('GET /home', () => {
        it('should return all products and render the home page', async () => {
            const res = await request(app).get('/home');
            expect(res.status).to.equal(200);
            expect(res.text).to.include('<h1>Home Page</h1>');
        });
    });

    describe('GET /prod/:id', () => {
        it('should return a single product and render the prod page', async () => {
            const res = await request(app).get('/prod/1');
            expect(res.status).to.equal(200);
            expect(res.text).to.include('<h1>Product Page</h1>');
        });
    });

    describe('POST /products', () => {
        it('should create a new product and redirect to the home page', async () => {
            const res = await request(app)
                .post('/products')
                .send({
                    name: 'Product 3',
                    price: 30.99,
                    description: 'This is product 3'
                });
            expect(res.status).to.equal(302);
        });
    });

    describe('DELETE /products/:id', () => {
        it('should delete a product and redirect to the home page', async () => {
            const res = await request(app).delete('/products/1');
            expect(res.status).to.equal(302);
        });
    });

    describe('PUT /products/:id', () => {
        it('should update a product and redirect to the home page', async () => {
            const res = await request(app)
                .put('/products/1')
                .send({
                    name: 'Product 4',
                    price: 40.99,
                    description: 'This is product 4'
                });
            expect(res.status).to.equal(302);
        });
    });
});

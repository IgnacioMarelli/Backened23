import supertest from 'supertest';
import {expect} from 'chai';
import mongoose from 'mongoose';
import config from '../data.js';
describe('CartController', () => {
    const requester = supertest('http://localhost:8080/api');
    let cookie;
    let cid;
    const pid ='64ac762a0cb7906010e17318';
    describe('Test de endpoints de carros', ()=>{
        before(async function () {
            await mongoose.connect(config.MONGO_URL_TEST,{
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
            await mongoose.connection.db.collection('carts').deleteMany({});
          });
          it('El endpoint PUT /api/carts/:cid/products/:pid debe traer un único carrito', async ()=>{
            const resLog= await requester
            .post("/users/login")
            .send({ email:'hio@hohtml.cpm', password: 'testpass' });
            const cookieresult = resLog.headers["set-cookie"][0];
            cookie = {
              name: cookieresult.split("=")[0],
              value: cookieresult.split("=")[1].split(";")[0],
            };
            const res = await requester
            .put(`/carts/${undefined}/products/${pid}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            cid=res.body._id
            expect(res.body.products[0].product).to.be.ok;
            expect(res.status).to.equal(200);
        })
        it('El endpoint GET /api/carts/:cid debe traer un único carrito', async ()=>{
            const res = await requester
            .get(`/carts/${cid}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(res.status).to.equal(200);
            expect(res.ok).to.be.true;
        })
        it('El endpoint delete /api/:cid/products/:pid debe eliminar un producto', async ()=>{
            const res = await requester
            .delete(`/carts/${cid}/products/${pid}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(res.body).to.be.deep.equal([ { _id: cid, products: [], __v: 0 } ])
            expect(res.status).to.equal(200);
            expect(res.ok).to.be.true;
        })
        it('El endpoint delete /api/:cid debe eliminar un carrito', async ()=>{
            const res = await requester
            .delete(`/carts/${cid}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(res.text).to.be.deep.equal('Carrito eliminado')
            expect(res.status).to.equal(200);
            expect(res.ok).to.be.true;
        })
    })
})
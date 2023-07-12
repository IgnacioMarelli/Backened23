import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../data.js';
describe('Router users', () => {
  const requester = supertest('http://localhost:8080/')
  let cookie;
  describe('Test de endpoints de Users', ()=>{
    before(async function () {
      await mongoose.connect(config.MONGO_URL_TEST,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await mongoose.connection.db.collection('usuarios').deleteMany({});
    });
    it('deberia llamar al register', async function() {
      const newUser = { first_name: 'test', last_name:'users',email:'hio@hohtml.cpm',age:98,role:'admin', password: 'testpass' };
      const res = await requester
        .post('api/session/register')
        .send(newUser)
        expect(res.status).to.equal(201);
        expect(res.text).to.deep.equal('Creado');      
    });
    it('deberia loguear al usuario', async function() {
      const newUser = { email:'hio@hohtml.cpm', password: 'testpass' };
      const res= await requester
        .post("api/session/login")
        .send(newUser);
      expect(res.ok).to.be.true;
      const cookieresult = res.headers["set-cookie"][0];
      cookie = {
        name: cookieresult.split("=")[0],
        value: cookieresult.split("=")[1].split(";")[0],
      };
      expect(cookie.name).to.be.equals("AUTH");
      expect(cookie.value).to.be.ok;
    });
    it('deberia dar un error al llamar al register', async function() {
      const newUser = { first_name: 'test', last_name:'users',email:'hio@hohtml.cpm',age:98,role:'admin', password: 'testpass' };
      const res = await requester
        .post('api/session/register')
        .send(newUser)
        expect(res.status).to.equal(400);
        expect(res._body.error).to.deep.equal('El usuario con ese mail, ya se encuentra registrado');      
    });
  });
})
import { expect } from 'chai';
import supertest from 'supertest';
import userService from '../dao/Repository/user.repository.js';
import mongoose from 'mongoose';
import config from '../../data.js';
describe('Router users', () => {
  const requester = supertest('http://localhost:8080/api')

  describe('Test de endpoints de Users', ()=>{
    beforeEach(async function () {
      const connection = await mongoose.connect(config.MONGO_URL_TEST,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await mongoose.connection.db.collection('usuarios').deleteMany({});
    });
    it('deberia llamar al register', async function() {
      const res = await requester
        .post('/session/register')
        .send({ first_name: 'test', last_name:'users',email:'hio@hohtml.cpm',age:98,role:'admin', password: 'testpass' });
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: 'User registered successfully' });
      expect(await userService.findByEmail('hio@hohtml.cpm')).to.be.true;
    });
  });
})

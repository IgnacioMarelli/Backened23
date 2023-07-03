import { expect } from 'chai';
import supertest from 'supertest';
describe('UsersController', () => {
    const requester = supertest('http://localhost:8080/api')
    describe('Test de endpoints de Users', ()=>{
        beforeEach(async function () {
            const connection = await mongoose.connect('mongodb://localhost:27017/test');
            await mongoose.connection.db.collection('usuarios').deleteMany({});
        })
      it('should call the postRegister method of the service and redirect to /api/session/login', async () => {
        const res =await requester
          .post('/api/session/register')
          .send({ first_name: 'test', last_name:'users',email:'hio@hohtml.cpm',age:98,role:'admin', password: 'testpass' })

            expect(res.body).to.have.property('message', 'User registered successfully');
            expect(userService.postRegister).to.have.been.calledOnce;
          });
      });
      it('should call the postLogin method of the service and return the user', (done) => {
        supertest(app)
          .post('/api/session/login')
          .send({ username: 'testuser', password: 'testpass' })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('username', 'testuser');
            expect(userService.postLogin).to.have.been.calledOnce;
            done();
          });
      });
      it('should call the updateUser method of the service and return success', (done) => {
        supertest(app)
          .put('/api/users/1')
          .send({ username: 'updateduser' })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('message', 'User updated successfully');
            expect(userService.updateUser).to.have.been.calledOnce;
            done();
          });
      });
    });
  });
  
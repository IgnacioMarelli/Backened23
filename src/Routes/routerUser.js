import { Router } from 'express';
import { userModel } from '../dao/models/users.js';
const routerUser = Router();
import { alreadyEmail, authenticated } from '../utils/authentication.js';
import { createHash, isValidPassword } from '../utils/crypto.js';
import passport from 'passport';
import { generateToken } from '../utils/jwt.middlewar.js';
import { passporCall } from '../utils/authentication.js';



routerUser.get('/register',alreadyEmail, (req, res) => {
    res.render('register', {
        style: 'style',
    });
});

routerUser.post('/register',passport.authenticate('jwt', {session : false}), async (req, res, next) => {
  const usuario = req.body;
  const hashedPassword = createHash(req.body.password);
  if (usuario.email==='adminCoder@coder.com'&& usuario.password==='adminCod3r123') {
    usuario.role='admin';
  }
  try {
    await userModel.create({...usuario, password: hashedPassword});
    res.status(201).redirect('/users/login');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

routerUser.get('/login',alreadyEmail, (req, res) => {
    res.render('login');
});

routerUser.get('/perfil', passporCall('jwt'), async (req, res) => {
    const user = req.user;

    res.render('perfil', {
        nombre: user.name,
        apellido: user.lastname,
        edad: user.age,
        email: user.email,
    });
});
  
routerUser.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !isValidPassword(password, user.password)) {
      return res.status(401).send({
        error: 'email o contraseña incorrectos',
      }); 
    }
    const token = generateToken({...user, password: undefined});
    res.cookie('AUTH',token,{
      maxAge:60*60*1000*24,
      httpOnly:true
    });
    res.redirect('/products');
});


routerUser.post('/auth/logout', authenticated, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.redirect('/login');
      }
    });
});
routerUser.put('/:idUsuario', async (req, res, next) => {
    const idUsuario = req.params.idUsuario;
  
    try {
      const usuario = await userModel.find({ _id: idUsuario });
      if (!usuario) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idUsuario} no encontrado` });
        return;
      }
      const nuevosDatos = req.body;
  
      await userModel.updateOne(
        { _id: idUsuario },
        { ...usuario, ...nuevosDatos }
      );
      res.send({ ok: true });
    } catch (error) {
      next(error);
    }
});
  
routerUser.delete('/:idUsuario', async (req, res, next) => {
    try {
      const idUsuario = req.params.idUsuario;
      await userModel.deleteOne({ _id: idUsuario });
      res.send({ ok: true });
    } catch (error) {
      next(error);
    }
});
routerUser.post('restore-password', async (req, res)=>{
  const {email, newPassword}=req.body;
  const user = await userModel.findOne({email});
  if(!user){
    res.status(404).send({error: 'No existe el usuario'});
    return
  }
  const hashedPassword = createHash(newPassword);
  await userModel.updateOne({email}, {$set:{password:hashedPassword}});
  res.status(200).send({message:'Contraseña modificada'})
})
routerUser.get('restore-password', async (req, res)=>{
  res.render('restorePassword')
})

routerUser.get('/githubbutton', passport.authenticate('github', {scope: ['user:email']}), (req, res)=>{
})
routerUser.get('/github', passport.authenticate('github', {failureRedirect: '/login'}), (req, res)=>{
  res.redirect('/users/perfil');
})
export  { routerUser};
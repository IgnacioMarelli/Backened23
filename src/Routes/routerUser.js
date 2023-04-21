import { Router } from 'express';
import { userModel } from '../dao/models/users.js';
const routerUser = Router();
import { authenticated } from '../utils/authentication.js';
import { createHash, isValidPassword } from '../utils/crypto.js';
import passport from 'passport';
import { generateToken } from '../utils/jwt.middlewar.js';
import { passportCall } from '../utils/authentication.js';



routerUser.get('/register', (req, res) => {
  if (req.user) {
    res.redirect('/users/perfil')
  }
    res.render('register', {
        style: 'style',
    });
});

routerUser.post('/register', async (req, res, next) => {
  const usuario = req.body;
  const hashedPassword =await createHash(req.body.password);
  if (usuario.email==='adminCoder@coder.com'&& usuario.password==='Cod3r123') {
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

routerUser.get('/login', (req, res) => {
  if (req.cookies['AUTH']) {
    res.redirect('/users/perfil')
  }
    res.render('login');
});

routerUser.get('/perfil', passportCall('jwt'), async (req, res) => {
    const user = req.user._doc;

    res.render('perfil', {
        nombre: user.name,
        apellido: user.lastname,
        edad: user.age,
        email: user.email,
        user:user,
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
    res.send(user);
});


routerUser.post('/auth/logout', (req, res) => {
    res.clearCookie('AUTH')
    res.redirect('/users/login');
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
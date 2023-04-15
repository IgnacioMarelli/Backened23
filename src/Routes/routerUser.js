import { Router } from 'express';
import { userModel } from '../dao/models/users.js';
const routerUser = Router();
import { authenticated } from '../utils/authentication.js';




routerUser.get('/register', (req, res) => {
    const email = req.session.user;
    if (email) {
        return res.redirect('/perfil');
    }
    res.render('register', {
        style: 'style',
    });
});
routerUser.post('/register', async (req, res, next) => {
  const email = req.session.user;
  if (email) {
    return res.redirect('/perfil');
  }
  const usuario = req.body;
  try {
    const { _id } = await userModel.create(usuario);

    res.status(201).send({ id: _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
/*
routerUser.get('/users/:id', async (req, res) => {
    const user = await usuarioManager.get(req.params.id);
    if (!user) {
        res.render('notFound', {
        style: 'style',
        entidad: 'Usuario',
        });
        return;
    }
    res.render('viewUsuario', {
        style: 'style',
        user,
    });
});*/

routerUser.get('/mensaje', (req, res) => {
    res.render('mensaje');
});

routerUser.get('/login', (req, res) => {
    const email = req.session.user;
    if (email) {
        return res.redirect('/users/perfil');
    }
    res.render('login');
});

routerUser.get('/perfil', authenticated, async (req, res) => {
    const user = req.user;

    res.render('perfil', {
        nombre: user.nombre,
        apellido: user.apellido,
        edad: user.edad,
        email: user.email,
    });
});
  
routerUser.post('/login', async (req, res) => {
    const alreadyEmail = req.session.user;
    if (alreadyEmail) {
      return res.redirect('/users/perfil');
    }
    const { email, password } = req.body;
  
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(401).send({
        error: 'email o contraseña incorrectos',
      });
    }
    req.session.user = email;
    res.redirect('/users/perfil');
});
routerUser.post('/logout', authenticated, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.redirect('/login');
      }
    });
});
routerUser.get('/:idUsuario', async (req, res, next) => {
    try {
      const idUsuario = req.params.idUsuario;
  
      const usuario = await userModel.findOne({ _id: idUsuario });
      if (!usuario) {
        res
          .status(404)
          .send({ error: `Usuario con id ${idUsuario} no encontrado` });
        return;
      }
      res.send({ usuario });
    } catch (error) {
      next(error);
    }
});


routerUser.post('/', async (req, res, next) => {
    const email = req.session.user;
    if (email) {
      return res.redirect('/perfil');
    }
    const usuario = req.body;
  
    try {
      const { _id } = await userModel.create(usuario);
  
      res.status(201).send({ id: _id });
    } catch (error) {
      next(error);
    }
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

export  { routerUser};
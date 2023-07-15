import passport from "passport";
import jwt  from "jsonwebtoken";
import CustomError from "../../errors/custom.error.js";
import ErrorEnum from "../../errors/error.enum.js";
import config from "../../../data.js";
const secret = config.SECRET;

const passportCall = (strategy) => {
  return async (req, res, next) => {
    try {
      passport.authenticate(strategy, { users: false }, (error, user, info) => {
        if (error) return next(error);
        if (!user) {
          throw CustomError.createError({
            name: 'Usuario no logueado',
            cause: 'No se logueó correctamente el usuario',
            message: 'Debe iniciar sesión nuevamente',
            code: ErrorEnum.BODY_ERROR
          });
        }
        req.user = user.user;
        next();
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
const newPass = () => {
  return async (req, res, next) => {
    try {
      const token = req.params.token;
      const decoded = jwt.verify(token, secret);
      if (decoded) {
        req.user = decoded.email;
        res.cookie('AUTH',token,{
          maxAge:60*60*1000,
          httpOnly:true
        });
        next();
      } else {
        res.redirect('/users/login');
      }
    } catch (error) {
      next(error);
    }
  };
};
const authorization = (rol)=>{
  return async (req, res, next)=>{
    try {
      if(req.user.role !== rol) return res.status(403).send({error: ` Usuario sin rol de ${rol}`});
      next();
    } catch (error) {
      next(error) 
    }

  }
}
const authorizationPremium = (rol)=>{
  return async (req, res, next)=>{
    try {
      if(req.user.role !== rol&& req.user.role !=='premium') return res.status(403).send({error: ` Usuario sin rol de ${rol}`});
      next();
    } catch (error) {
      next(error)
    }

  }
}

export {authorization, passportCall, newPass, authorizationPremium}
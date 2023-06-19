import passport from "passport";
import jwt  from "jsonwebtoken";
import CustomError from "../errors/custom.error.js";
import ErrorEnum from "../errors/error.enum.js";
import config from "../../data.js";
const secret = config.SECRET;

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, {session : false}, (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        return res.status(401).send({error: "Usuario no logueado"});
      }
      req.user = user.user;
      next();
    })(req, res, next); 
  };
};
const newPass = () => {
  return async (req, res, next) => {
    try {
      const decoded = jwt.verify(req.params.token, secret);
      if (decoded) {
        req.user = decoded.email;
        next();
      } else {
        throw new CustomError.createError({
          name: 'Not Authorized',
          cause: 'No está autorizado para cambiar la contraseña o los parámetros son incorrectos',
          message: 'Vuelva a utilizar la opción de cambiar contraseña',
          code: ErrorEnum.BODY_ERROR
        });
      }
    } catch (error) {
      next(error);
    }
  };
};
const authorization = (rol)=>{
  return async (req, res, next)=>{
    if(req.user.role !== rol) return res.status(403).send({error: ` Usuario sin rol de ${rol}`});
    next();
  }
}
export {authorization, passportCall, newPass}
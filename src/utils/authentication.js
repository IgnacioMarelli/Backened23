import { userModel } from "../dao/models/users.model.js";
import passport from "passport";
const authenticated = async (req, res, next) => {
    const email = req.session.user;
    if (email) {
      const user = await userModel.findOne({ email });
      req.user = user;
      next();
    } else {
      res.redirect('/users/login');
    }
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, {session : false}, (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        return res.status(401).send({ info: info.message });
      }
      req.user = user.user;
      next();
    })(req, res, next); 
  };
};



export const authorization = (rol)=>{
  return async (req, res, next)=>{
    if(!req.user) return res.status(401).send({error: "Usuario no logueado"});
    if(req.user.role !== rol) return res.status(403).send({error: ` Usuario sin rol de ${rol}`});
    next();
  }
}
export {authenticated, passportCall}
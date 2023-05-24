import passport from "passport";

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


const authorization = (rol)=>{
  return async (req, res, next)=>{
    if(req.user.role !== rol) return res.status(403).send({error: ` Usuario sin rol de ${rol}`});
    next();
  }
}
export {authorization, passportCall}
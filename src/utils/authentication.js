import { userModel } from "../dao/models/users.js";
const authenticated = async (req, res, next) => {
    const email = req.session.user;
    if (email) {
      const user = await userModel.findOne({ email });
      req.user = user;
      next();
    } else {
      res.redirect('/user/login');
    }
};
const alreadyEmail = async(req,res,next)=>{
  const alreadyEmail = req.session.user;
  if (alreadyEmail) {
    return res.redirect('/users/perfil');
  }
  next();
}
export {authenticated, alreadyEmail}
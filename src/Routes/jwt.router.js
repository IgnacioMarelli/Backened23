import { Router } from "express";
import { userModel } from "../dao/models/users";
import jwt from 'jsonwebtoken';

const SECRET = 'CODER_SECRET';
const users= [];
const routerUser = Router();
routerUser.post('/register', (req, res)=>{
    const user = reqbody;
    
})
routerUser.post('/login',alreadyEmail, async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !isValidPassword(password, user.password)) {
      return res.status(401).send({
        error: 'email o contraseña incorrectos',
      }); 
    }
    let token = jwt.sign({email, password},'SECRET',{expiresIn:"24h"})
    res.cookie('AUTH',token,{
        maxAge:60*60*1000*24,
        httpOnly:true
    });
    res.send({ token})
});

async function login(event) {
    const password = document.getElementById('form-password').value;
    const email = document.getElementById('form-email').value;
    event.preventDefault();
    api.post('/users/login', {
        email,
        password
        })
        .then(result=> result.json()).then(json=>{

            Swal.fire({
                text:json.message,
                icon: 'success'
              }).then(() => {
                setTimeout(()=>location.href = 'http://localhost:8080/products',2000) ;                  
        })
    })}



function generateToken(user) {
    const token = jwt.sign({user}, SECRET, {expiresIn:'24h'});
    return token
}
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split('')[1];
    if (token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, SECRET, (err, {user})=>{
        if (err) {
            return res.sendStatus(403);
        }
        req.user = payload.user;
        next()
    })
}
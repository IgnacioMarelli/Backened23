import passport from "passport";
import local from 'passport-local';
import github from 'passport-github2';
import { userModel } from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import jwt from 'passport-jwt';
import config from "../data.js";
const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;
const JWTStrategy = jwt.Strategy;

function cookieExtractor(req) {
    return req?.cookie?.['AUTH'];
}



export function configPassport() {

        passport.use('jwt',
        new JWTStrategy({
            jwtFromRequest:jwt.ExtractJwt.fromExtractors([
            cookieExtractor,
            jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),secretOrKey:'SECRETO',
        }, async(jwt_payload, done)=>{
            try {
            const user =jwt_payload;
            return done(null, user)
            } catch (error) {
                return done(error, false, {message:'Usuario o contraseña incorrectas'})
            }
        } 
        )
        ); 

   /* try {
        passport.use('github', new GithubStrategy({
            clientID:config.github_client_id,
            clientSecret:config.github_client_secret,
            callbackURL:config.github_callback_url
        }, async(req, accesToken, refreshToken, profile, done)=>{
            const email = profile._json.email;
            const user = await userModel.findOne({email:email});
            if (!user) {
                const newUser = await userModel.create({
                    email: email,
                    name: profile._json.name,
                    lastname:'-',
                    password:'-',
                    age:4,
                })
                return done(null,newUser);
            }
            req.session.user = email;
            return done(null,user);
        })
        );
    } catch (error) {
        done(error);
    }
    try {
        passport.use('register', new LocalStrategy({
            passReqToCallback: true,/*para usar request
            usernameField:'email'
        },async (req, username, password, done)=>{
            const {age, email, lastname, name} = req.body;
            const userExists = await userModel.findOne({email: username})
            if (userExists) {
                return done(null, false); /* false porque no puedo registrar un usuario que ya existe 
            }
            const newUser = await userModel.createCollection({
                name, age, lastname, email:username, password: createHash(password)
            })
            return done(null,{
                email: newUser.email,
                name: newUser.name,
                lastname:newUser.lastname,
                age:newUser.age
            })
        }));
    } catch (error) {
        done(error);
    }
    try {
        passport.use('login', new LocalStrategy({
            usernameField:'email'
        },async ( username, password, done)=>{
            const user = await userModel.findOne({email: username})
            if (!user) {
                console.log('No existe el usuario');
                return done(null, false); /* false porque no puedo registrar un usuario que ya existe 
            }
            if(!isValidPassword(password, user.password)){
                console.log('Contraseña incorrecta');
                return done(null, false);
            }
            return done(null,user);
        }));
    } catch (error) {
        done(error);
    }
    */
    passport.serializeUser((user, done)=>done(null, user._id));
    passport. deserializeUser(async (id, done)=>{
        const user = await userModel.findOne({_id:id});
        done(null, user);
    })
}
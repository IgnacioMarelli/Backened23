import passport from "passport";
import local from 'passport-local';
import github from 'passport-github2';
import { userModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import jwt from 'passport-jwt';
import config from "../data.js";
const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;
const JWTStrategy = jwt.Strategy;

function cookieExtractor(req) {
    return req.cookies['AUTH'];
}



export function configPassport() {
    passport.use('jwt',
        new JWTStrategy({
            jwtFromRequest: jwt.ExtractJwt.fromExtractors([
                cookieExtractor
            ]),
            secretOrKey: 'CODER_SECRET',
        }, (payload, done) => {
            try {
                return done(null, payload)
            } catch (error) {
                return done(error, false, { message: 'Usuario o contraseña incorrectas' })
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findOne({ _id: id });
        done(null, user);
    });
}
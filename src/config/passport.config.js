import passport from "passport";
import GitHubStrategy from 'passport-github2';
import local from "passport-local";
import userModel from "../models/users.js";
import { isValidPassword, createHash } from "../utils.js";
import * as dotenv from 'dotenv';

dotenv.config();

const LocalStrategy = local.Strategy;
const initializePassport = () => {

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;
        try {
            const user = await userModel.findOne({email: username});
            if(user) {
                return done(null, false, {message: 'El usuario ya existe'});
            } else {
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }

                const result = await userModel.create(newUser);
                return done(null, result);
            }
        } catch (error) {
            return done('Error al obtener el usuario: ' + error);
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'username'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username});
            if(!user) {
                return done(null, false, {message: 'Usuario no encontrado'})
            } else {
                const match = isValidPassword(password, user.password);
                if(match) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Contraseña incorrecta'});
                }
            }
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3434/login/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile);
            let user = await userModel.findOne({email: profile._json.email});
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password:''
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    }))
}

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
});

export default initializePassport;
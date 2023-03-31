import passport from "passport";
import local from "passport-local";
import userModel from "../models/users.js";
import { isValidPassword, createHash } from "../utils.js";

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
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            
        } catch (error) {
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
        }
    }));
}

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    await userModel.findById(id, (err, user) => {
        done(err, user);
    })
});

export default initializePassport;
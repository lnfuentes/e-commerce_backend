import { Router } from "express";
import passport from "passport";
import { generateToken, authToken } from "../jwt.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('login', {title: 'Login', style: 'login.css'});
});

const auth = async (req, res, next) => {
    if(await req.session?.user) {
        return next();
    } else {
        return res.status(401).send('Error de autenticacion');
    }
}

router.post('/', passport.authenticate('login', {failureRedirect: '/login'}) , async (req, res) => {
    if(!req.user) return res.status(400).json({message: 'error', error: 'Datos Invalidos'});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };
    req.session.admin = true;

    const accessToken = generateToken({
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    })

    console.log(accessToken)
    
    res.status(200).json({message: 'success', data: req.user, accessToken});
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) {
            res.status(401).send({message: 'ERROR'});
        } else {
            res.status(200).send({message: 'Sesion cerrada'})
        }
    })
});

router.get('/github', passport.authenticate('github', {scope:['user: email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})
export default router;
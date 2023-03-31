import { Router } from "express";
import passport from "passport";

const router = Router();

router.get('/', (req, res) => {
    res.render('login', {title: 'Login', style: 'login.css'});
});

router.post('/', passport.authenticate('login', {failureRedirect: '/login'}) , async (req, res) => {
    if(!req.user) return res.status(400).json({message: 'error', error: 'Datos Invalidos'});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    
    res.status(200).json({message: 'success', data: req.user});
});

router.get('/github', passport.authenticate('github', {scope:['user: email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})
export default router;
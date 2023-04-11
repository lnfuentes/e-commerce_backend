import { Router } from "express";
import passport from "passport";
import { generateToken, authToken } from "../jwt.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('signup', {title: 'Signup', style: 'signup.css'});
});

router.post('/', passport.authenticate('signup', {failureRedirect: '/signup'}), async (req, res) => {
    const accessToken = generateToken(req.body);
    res.status(200).send({message: 'success', data: 'Usuario registrado', accessToken});
});

export default router;
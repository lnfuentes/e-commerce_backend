import { Router } from "express";
import userModel from "../models/users.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('signup', {title: 'Signup', style: 'signup.css'});
});

router.post('/', async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;
    try {
        const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            password,
            age
        });
        res.status(201).send({message: 'success', newUser});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
});

export default router;
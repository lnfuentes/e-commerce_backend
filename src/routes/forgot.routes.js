import { Router } from "express";
import userModel from "../models/users.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('forgot', {title: 'Forgot', style: 'forgot.css'});
});

router.post('/', async (req, res) => {
    const {username, password, repeatPassword} = req.body;
    let newPassword = createHash(password);

    if(!username || !password) {
        res.status(400).json({message: 'error', data: 'Faltan campos'});
    }

    if(!isValidPassword(repeatPassword, newPassword)) {
        res.status(400).json({message: "error", data: "Las contraseñas no coinciden"});
        return;
    }

    try {
        const response = await userModel.findOne({email: username});
        if (!response) {
            res.status(404).json({message: 'error', data: 'El usuario no existe'});
            return;
        } else {
            const result = await userModel.findOneAndUpdate({email: username}, {password: newPassword});
            if(result) {
                res.status(200).json({message: 'success', data: 'Contraseña actualizada'});
                console.log(result);
            }
            return;
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;
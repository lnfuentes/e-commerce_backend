import { Router } from "express";
import {cartModel} from "../models/cart.js"
import { CartManager } from "../data/classes/DBManager.js";

const cartManager = new CartManager();
const carts = cartManager.read()
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await carts;
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = await cartManager.getCartById(req.params.cid);
    res.status(200).send(cartId);
})

router.post('/', async (req, res) => {
    try {
        const result = await cartManager.create();
        res.status(200).send({message: 'Carrito creado', result});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await cartManager.updateCartProd(cid, pid);
        res.status(200).send({message: 'Carrito actualizado', result})
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const response = await cartManager.delete(id);
        res.status(200).send({message: 'Carrito eliminado', response});
    } catch(error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const newProduct = req.body;
    try {
        const response = await cartManager.update(id, newProduct);
        res.status(200).send({message: 'Carrito actualizado', response});
    } catch (error) {
        throw new Error(error.message);
    }
});

export default router;
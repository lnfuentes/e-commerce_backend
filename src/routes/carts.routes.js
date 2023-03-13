import { Router } from "express";
import {cartModel} from "../models/cart.js"
import { CartManager } from "../data/classes/DBManager.js";

const cartManager = new CartManager();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const result = await cartManager.read(limit);
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

router.post("/:cid/:pid", async (req, res) => {
    try {
      const {cid} = req.params;
      const {pid} = req.params;
      const result = await cartManager.updateCartProd(cid, pid);
      res.send({
        message: "Carrito actualizado", result});
    } catch (err) {
      res.status(500).send("Cart not found");
      const error = err.message;
      console.log(error);
    }
  });

router.delete('/:cid', async (req, res) => {
    const {cid} = req.params;
    try{
        const result = await cartManager.delete(cid);
        res.status(200).send({message: 'Carrito eliminado', result});
    } catch(error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const {cid} = req.params;
        const {pid} = req.params;
        const result = await cartManager.deleteCartProduct(cid, pid);
        res.status(200).send({message: 'Producto eliminado', result});
    } catch(error) {
        res.status(500).send(error.message);
    }
})

router.delete('/:cid/products', async (req, res) => {
    try {
        const {cid} = req.params;
        const result = await cartManager.deleteAllProducts(cid);
        res.status(200).send({message: 'Carrito vaciado', result});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.put('/:cid', async (req, res) => {
    const {cid} = req.params;
    const newProduct = req.body;
    try {
        const result = await cartManager.updateCart(cid, newProduct);
        res.status(200).send({message: 'Carrito actualizado', result});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const {cid} = req.params;
        const {pid} = req.params;
        const quantity = req.body;
        const result = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).send({message: 'Cantidad del producto actualizada', result})
    } catch (error) {
        res.status(500).send(error.message);
    }
})

export default router;
import { Router } from "express";

const router = Router();

router.get("/products", async (req, res) => {
  res.render("products", { title: "Productos"});
});

router.get("/cart", async (req, res) => {
  res.render("carts", { title: "Carrito" });
});

export default router;
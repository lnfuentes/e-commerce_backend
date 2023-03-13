import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("profile", { title: "Login", styles: "css/profile.css" });
});

export default router;
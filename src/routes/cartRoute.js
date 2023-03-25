import express from "express";
import { addToCart, getCart } from "../controllers/cart.js";
import { verifyUser } from "../middlewares/auth.js";
import { verifyCart } from "../middlewares/cart.js";

const router = express.Router();

// router.route("/create").post(verifyUser, createCart);
router.route("/").get(verifyUser, getCart);
router.route("/:type").post(verifyUser, verifyCart, addToCart);

export default router;
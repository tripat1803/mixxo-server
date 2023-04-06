import express from "express";
import { createProductDetails, deleteProductDetails, getProductDetails } from "../controllers/productDetails.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.route("/add").post(verifyAdmin, createProductDetails);
router.route("/:id").delete(verifyAdmin, deleteProductDetails);
router.route("/:id").get(verifyAdmin, getProductDetails);

export default router;
import express from "express";
import { createProductDetails, deleteProductDetails } from "../controllers/productDetails.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.route("/add").post(verifyAdmin, createProductDetails);
router.route("/:id").get(verifyAdmin, deleteProductDetails);

export default router;
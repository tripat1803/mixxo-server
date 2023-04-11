import express from "express";
import { createProduct, deleteProduct, deleteProductImage, getAllCategoryProducts, getAllProduct, getCategory, getProduct, getProductByCategory, updateProduct, uploadProductImage } from "../controllers/product.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.route("/all").get(getAllProduct);
router.route("/get/:id").get(getProduct);
router.route("/category").post(getCategory);
router.route("/category/:id").get(getProductByCategory);
router.route("/create").post(verifyAdmin, createProduct);
router.route("/upload").post(verifyAdmin, uploadProductImage);
router.route("/").post(verifyAdmin, deleteProduct);
router.route("/delete").post(verifyAdmin, deleteProductImage);
router.route("/group").get(getAllCategoryProducts);
router.route("/update").post(verifyAdmin, updateProduct);

export default router;

import express from "express";
import { createCategory, deleteCategory, getAllCategory } from "../controllers/category.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.route("/create").post(verifyAdmin, createCategory);
router.route("/all").get(getAllCategory);
router.route("/:id").get(verifyAdmin, deleteCategory);

export default router;

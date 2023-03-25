import express from "express";
import { createReview, getReview } from "../controllers/review.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/create").post(verifyUser, createReview);
router.route("/get").post(getReview);

export default router;
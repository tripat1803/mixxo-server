import express from "express";
import { checkout, getKey, verification } from "../controllers/payment.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/checkout").post(verifyUser, checkout);
router.route("/getKey").get(verifyUser, getKey);
router.route("/verification").post(verification);

export default router;
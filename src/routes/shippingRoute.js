import express from "express";
import { createShippingDetails, removeShippingDetails, sendDefault, setShippingIdAsDefault, updateShippingDetails } from "../controllers/shippingDetails.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/create").post(verifyUser, createShippingDetails);
router.route("/remove/:shippingId").get(verifyUser, removeShippingDetails);
router.route("/update").post(verifyUser, updateShippingDetails);
router.route("/").get(verifyUser, sendDefault);
router.route("/set/:shippingId").get(verifyUser, setShippingIdAsDefault);

export default router;
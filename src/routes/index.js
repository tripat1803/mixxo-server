import express from "express";
import userRoute from "./userRoute.js";
import productRoute from "./productRoute.js";
import categoryRoute from "./categoryRoute.js";
import cartRoute from "./cartRoute.js";
import shippingRoute from "./shippingRoute.js";
import productDetailsRoute from "./productDetailsRoute.js";
import reviewRoute from "./reviewRoute.js";
import recommendationRoute from "./recommendationRoute.js";
import orderRoute from "./orderRoute.js";
import paymentRoute from "./paymentRoute.js";
import subscriptionRoute from "../utils/subscriptionRoute.js";
import mobileCodeRoute from "../utils/mobileCodeRoute.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    message: "Hi",
  });
});

router.use("/api/user", userRoute);
router.use("/api/product", productRoute);
router.use("/api/category", categoryRoute);
router.use("/api/cart", cartRoute);
router.use("/api/shipping", shippingRoute);
router.use("/api/productdetails", productDetailsRoute);
router.use("/api/review", reviewRoute);
router.use("/api/recommend", recommendationRoute);
router.use("/api/order", orderRoute);
router.use("/api/subscription", subscriptionRoute);
router.use("/api/razorpay", paymentRoute);
router.use("/api/codes", mobileCodeRoute);

export default router;

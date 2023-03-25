import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import csurf from "csurf";
import cron from "node-cron";
import { connectDatabase } from "./config/database.js";
import userRoute from "./src/routes/userRoute.js";
import productRoute from "./src/routes/productRoute.js";
import categoryRoute from "./src/routes/categoryRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import shippingRoute from "./src/routes/shippingRoute.js";
import productDetailsRoute from "./src/routes/productDetailsRoute.js";
import reviewRoute from "./src/routes/reviewRoute.js";
import recommendationRoute from "./src/routes/recommendationRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import paymentRoute from "./src/routes/paymentRoute.js";
import subscriptionRoute from "./src/utils/subscriptionRoute.js";
import {
  createRecommendProducts,
  updateRecommendProducts,
} from "./src/controllers/recommendation.js";

dotenv.config();

const app = express();

// Database
connectDatabase();

app
  .set("trust proxy", true)
  .disable("x-powered-by")
  .use(cors())
  .use(express.json({ limit: "50mb" }))
  .use(express.urlencoded({ limit: "50mb", extended: false }))
  .get("/", (req, res) => {
    return res.json({
      message: "Hi",
    });
  })
  .use("/api/user", userRoute)
  .use("/api/product", productRoute)
  .use("/api/category", categoryRoute)
  .use("/api/cart", cartRoute)
  .use("/api/shipping", shippingRoute)
  .use("/api/productdetails", productDetailsRoute)
  .use("/api/review", reviewRoute)
  .use("/api/recommend", recommendationRoute)
  .use("/api/order", orderRoute)
  .use("/api/subscription", subscriptionRoute)
  .use("/api/razorpay", paymentRoute);

cron.schedule("* * 23 * * *", () => {
  createRecommendProducts();
  updateRecommendProducts();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running at port", port);
});

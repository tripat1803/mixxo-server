import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { connectDatabase } from "./config/database.js";
import routes from "./src/routes/index.js";
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
  .use("/", routes)

cron.schedule("* * 23 * * *", () => {
  createRecommendProducts();
  updateRecommendProducts();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running at port", port);
});

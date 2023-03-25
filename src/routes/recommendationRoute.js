import express from "express";
import { recommendProducts } from "../controllers/recommendation.js";
// import { RecommendProducts } from "../models/recommendProducts.model.js";

const router = express.Router();

router.route("/").get(recommendProducts);
// router.route("/create").get(async (req, res) => {
//     let newR = new RecommendProducts({
//         maxRated: [],
//         maxOrdered: [],
//         total: []
//     })

//     await newR.save();

//     res.status(200).json({
//         message: "saved"
//     })
// })

export default router;
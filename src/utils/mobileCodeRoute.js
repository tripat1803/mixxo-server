import express from "express";
import { codes } from "./codes.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.status(200).json(codes);
})

export default router;
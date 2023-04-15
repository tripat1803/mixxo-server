import express from "express";
import code from "./codes.json" assert { type: "json" };

const router = express.Router();

router.get("/", async (req, res) => {
    res.status(200).json(code);
})

export default router;
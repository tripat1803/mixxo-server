import express from "express";
import { createAdminUser, createUser, getUser, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/create").post(createUser);
router.route("/get").get(verifyUser, getUser);
router.route("/update").post(verifyUser, updateUser);
router.route("/admin/create").post(verifyAdmin, createAdminUser);

export default router;
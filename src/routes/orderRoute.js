import express from "express";
import { getUserOrderByPage, getUserOrder, updateOrder, getAllOrders, changeUserStatus, deleteOrder } from "../controllers/order.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(verifyUser, getUserOrderByPage);
router.route("/get").post(verifyUser, getUserOrder);
router.route("/update").post(verifyAdmin, updateOrder);
router.route("/all").post(verifyAdmin, getAllOrders);
router.route("/status").post(verifyAdmin, changeUserStatus);
router.route("/delete").post(verifyUser, deleteOrder);
// router.route("/create").post(verifyUser, createOrder);

export default router;
import express from "express";
import { verifyJWT, verifyStore } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    getOrderById,
    getAllOrdersByUser,
    updateDeliveryStatus,
    getAllOrdersBySeller,
} from "../controllers/order.controller.js";

const router = express.Router();

// Route to create an order
router.post("/create", verifyJWT, createOrder);

// Route to get an order by ID
router.get("/:id", verifyJWT, getOrderById);

// Route to get all orders by a user
router.get("/user/all", verifyJWT, getAllOrdersByUser);

// Route to update delivery status of an order
router.patch("/update-status", verifyJWT, verifyStore, updateDeliveryStatus);

// Route to get all orders by a seller
router.get("/seller/all", verifyJWT, verifyStore, getAllOrdersBySeller);

export default router;
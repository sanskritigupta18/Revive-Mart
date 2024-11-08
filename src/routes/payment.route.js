import express from "express";
import {
    createPayment,
    updatePaymentStatus,
    getPaymentById,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Optional: Use if authentication is required

const router = express.Router();

// Route to create a new payment
router.post("/create", verifyJWT, createPayment);

// Route to update payment status
router.patch("/update-status", verifyJWT, updatePaymentStatus);

// Route to get payment details by ID
router.get("/:payment_id", verifyJWT, getPaymentById);

export default router;
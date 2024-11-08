import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

// Create a new payment
const createPayment = asyncHandler(async (req, res) => {
    try {
        const { order_id, payment_method } = req.body;

        // Check if required fields are provided
        if (!order_id || !payment_method) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields (payment_id, order_id, payment_method) are required",
            });
        }

        // Create new payment record
        const payment = await Payment.create({
            order_id,
            payment_method,
        });

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment,
        });
    } catch (error) {
        throw new ApiError(500, "Error creating payment");
    }
});

// Update payment status
const updatePaymentStatus = asyncHandler(async (req, res) => {
    try {
        const { payment_id, payment_status } = req.body;

        // Validate payment status
        if (!["pending", "completed"].includes(payment_status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment status. Allowed values: pending, completed",
            });
        }

        // Find and update the payment status
        const payment = await Payment.findById(
            new mongoose.Types.ObjectId(payment_id),
            { payment_status },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            data: payment,
        });
    } catch (error) {
        throw new ApiError(500, "Error updating payment status");
    }
});

// Get payment details by ID
const getPaymentById = asyncHandler(async (req, res) => {
    try {
        const { payment_id } = req.params;

        const payment = await Payment.findById(new mongoose.Types.ObjectId(payment_id));

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        throw new ApiError(500, "Error fetching payment details");
    }
});

export { createPayment, updatePaymentStatus, getPaymentById };
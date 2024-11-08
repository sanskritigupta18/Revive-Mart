import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    payment_method: {
        type: String,
        enum: ["credit card", "UPI", "paypal"],
        required: true,
    },
    payment_status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
    transaction_date: { type: Date, default: Date.now },
});

export const Payment = mongoose.model("Payment", paymentSchema);

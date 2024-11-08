import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    seller:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    total_price: {
        type: Number,
        required: true,
    },
    order_date: {
        type: Date,
        default: Date.now(),
    },
    delivery_status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },
    payment_status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
},{timestamps: true});

export const Order = mongoose.model("Order", orderSchema);
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    couponBy:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    },
    discount_percentage: {
        type: Number,
        required: true,
    },
    valid_from: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    valid_until: {
        type: Date,
        required: true,
    },
    usage_limit: {
        type: Number,
        // required: true,
    },
});

export const Coupon = mongoose.model("Coupon", couponSchema);
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    brand: {
        type: String,
        required: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sizes: [
        {
            type: String,
        },
    ],
    colors: [
        {
            type: String,
        },
    ],
    stock_quantity: {
        type: Number,
        required: true,
    },
    is_Sold: {
        type: Boolean,
        default: false,
    },
    discount_percentage: {
        type: Number,
        default: 0,
    },
    image: { type: String },
},{timestamps: true});

export const Product = mongoose.model("Product", productSchema);
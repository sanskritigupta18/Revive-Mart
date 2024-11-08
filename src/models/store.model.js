import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        storeName: {
            type: String,
            required: true,
            index: true,
        },
        storeEmail: {
            type: String,
            required: true,
        },
        storePhone: {
            type: String,
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

export const Store = mongoose.model("Store", storeSchema);
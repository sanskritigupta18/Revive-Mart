import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    warehouse_location: {
        type: String,
    },
});

export const Inventory = mongoose.model("Inventory", inventorySchema);
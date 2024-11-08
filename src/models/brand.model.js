import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    logo_url: {
        type: String,
        required: true,
    },
});

export const Brand = mongoose.model("Brand", brandSchema);
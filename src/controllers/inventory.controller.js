import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const createInventory = asyncHandler(async (req, res) => {
    try {
        const { product_id, quantity, warehouse_location } = req.body;
        if (!product_id || !quantity || !warehouse_location) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const product = await Product.findById(
            new mongoose.Types.ObjectId(product_id)
        );

        if (!product) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while fetching product"));
        }

        const inventory = await Inventory.create({
            product_id: product._id,
            quantity,
            warehouse_location,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    inventory,
                    "Inventory created successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while creating inventory"));
    }
});

const updateInventory = asyncHandler(async (req, res) => {
    try {
        const { inventoryId, quantity, warehouse_location } = req.body;
        if (!inventoryId || !quantity || !warehouse_location) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const inventory = await Inventory.findByIdAndUpdate(
            new mongoose.Types.ObjectId(inventoryId),
            {
                quantity,
                warehouse_location,
            },
            { new: true }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    inventory,
                    "Inventory updated successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while updating inventory"));
    }
});

const deleteInventory = asyncHandler(async (req, res) => {
    try {
        const { inventoryId } = req.body;
        if (!inventoryId) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const inventory = await Inventory.findByIdAndDelete(
            new mongoose.Types.ObjectId(inventoryId),
            { new: true }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    inventory,
                    "Inventory deleted successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while deleting inventory"));
    }
});

export { createInventory, updateInventory, deleteInventory };
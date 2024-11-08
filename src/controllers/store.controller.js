import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Store } from "../models/store.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createStore = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        const { storeName, storeEmail, storePhone } = req.body;
        if (!storeName || !storeEmail || !storePhone) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const exisitingUser = await User.findById(id);
        if (!exisitingUser) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Invalid user"));
        }

        const store = await Store.create({
            userId: id,
            storeName,
            storeEmail,
            storePhone,
        });

        if (!store) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while creating store"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, store, "Store created successfully"));
    } catch (e) {
        return res
            .status(500)
            .json(new ApiError(500, "Error while creating store"));
    }
});

const updateStore = asyncHandler(async (req, res) => {
    try {
        const { storeId } = req.params;
        const { storeName, storeEmail, storePhone } = req.body;

        let updatedValues = {};

        if (storeName) {
            updatedValues.storeName = storeName;
        }
        if (storeEmail) {
            updatedValues.storeEmail = storeEmail;
        }
        if (storePhone) {
            updatedValues.storePhone = storePhone;
        }

        const store = await Store.findById(
            new mongoose.Types.ObjectId(storeId)
        );

        if (!store) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Invalid store id"));
        }

        const updatedStore = await Store.findByIdAndUpdate(
            store._id,
            updatedValues,
            { new: true }
        );

        if (!updatedStore) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while updating store"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, updateStore, "Store updated successfully")
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiError(500, "Error while updating store"));
    }
});

const deleteStore = asyncHandler(async (req, res) => {
    try {
        const { storeId } = req.params;

        const store = await Store.findById(
            new mongoose.Types.ObjectId(storeId)
        );

        if (!store) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Invalid store id"));
        }

        const updatedStore = await Store.findByIdAndDelete(
            store._id,
        );

        if (!updatedStore) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while deleting store"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, updateStore, "Store deleted successfully")
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiError(500, "Error while deleting store"));
    }
});

export { createStore, updateStore, deleteStore };
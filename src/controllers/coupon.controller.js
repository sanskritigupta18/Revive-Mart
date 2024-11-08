import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.model.js";
import { Store } from "../models/store.model.js";
import mongoose from "mongoose";

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const { storeId } = req?.params;
        const {
            code,
            discount_percentage,
            valid_from,
            valid_until,
            usage_limit,
        } = req.body;

        if (
            !code ||
            !discount_percentage ||
            !valid_from ||
            !valid_until ||
            !usage_limit
        ) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const store = await Store.findById(
            new mongoose.Types.ObjectId(storeId)
        );

        if (!store) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Store not found"));
        }

        const couponDetails = {
            code,
            couponBy: store._id,
            discount_percentage,
            valid_from,
            valid_until,
            usage_limit,
        };

        const coupon = await Coupon.create(couponDetails);

        if (!coupon) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while creating coupon"));
        }

        return res
            .status(201)
            .json(new ApiResponse(201, coupon, "Coupon created successfully"));
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while creating coupon"));
    }
});

const editCoupon = asyncHandler(async (req, res) => {
    try {
        const { couponId } = req?.params;
        const {
            code,
            discount_percentage,
            valid_from,
            valid_until,
            usage_limit,
        } = req.body;

        const coupon = await Coupon.findById(
            new mongoose.Types.ObjectId(couponId)
        );

        if (!coupon) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Coupon not found"));
        }

        const couponDetails = {};

        if(code)
        {
            couponDetails.code = code;
        }

        if (discount_percentage) {
            couponDetails.discount_percentage = discount_percentage;
        }

        if (valid_from) {
            couponDetails.valid_from = valid_from;
        }

        if (valid_until) {
            couponDetails.valid_until = valid_until;
        }

        if (usage_limit) {
            couponDetails.usage_limit = usage_limit;
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            coupon._id,
            couponDetails,
            { new: true }
        );

        if (!updatedCoupon) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while updating coupon"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedCoupon,
                    "Coupon updated successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while updating coupon"));
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        const { couponId } = req?.params;

        const coupon = await Coupon.findById(
            new mongoose.Types.ObjectId(couponId)
        );

        if (!coupon) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Coupon not found"));
        }

        const deletedCoupon = await Coupon.findByIdAndDelete(coupon._id);

        if (!deletedCoupon) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while deleting coupon"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    deletedCoupon,
                    "Coupon deleted successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while deleting coupon"));
    }
});

const getCouponByStore = asyncHandler(async (req, res) => {
    try {
        const { storeId } = req?.params;

        const store = await Store.findById(
            new mongoose.Types.ObjectId(storeId)
        );

        if (!store) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Store not found"));
        }

        const coupon = await Coupon.aggregate([
            {
                $match: {
                    couponBy: new mongoose.Types.ObjectId(storeId),
                },
            },
        ]);

        if (!coupon || coupon.length === 0) {
            return res
                .status(404)
                .json(
                    new ApiResponse(404, {}, "No coupons found for this store")
                );
        }

        return res
            .status(200)
            .json(new ApiResponse(200, coupon, "Coupons fetched successfully"));
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while fetching coupons"));
    }
});

export { createCoupon, editCoupon, deleteCoupon, getCouponByStore };
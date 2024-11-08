import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const createReview = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        const { product_id, rating, comment } = req.body;

        if (!product_id || !rating || !comment) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const user = await User.findById(id);
        if (!user) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while getting user"));
        }

        const product = await Product.findById(
            new mongoose.Types.ObjectId(product_id)
        );
        if (!product) {
            return res
                .status(500)
                .json(
                    new ApiResponse(
                        500,
                        {},
                        "Error while getting product details"
                    )
                );
        }

        const review = await Review.create({
            user_id: id,
            product_id: product._id,
            rating,
            comment,
        });

        if (!review) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while creating review"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, review, "Review created successfully"));
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while creating review"));
    }
});

const updateReview = asyncHandler(async (req, res) => {
    try {
        const { reviewId,rating, comment } = req.body;

        if (!reviewId) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const updatedDetails = {};

        if(rating)
        {
            updatedDetails.rating = rating;
        }

        if(comment)
        {
            updatedDetails.comment = comment;
        }

        const updatedReview = await Review.findByIdAndUpdate(
            new mongoose.Types.ObjectId(reviewId),
            updatedDetails,
            { runValidators: false, new: true }
        );

        if (!updatedReview) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while updating review"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedReview,
                    "Review updated created successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while updating review"));
    }
});

const deleteReview = asyncHandler(async (req, res) => {
    try {
        const { reviewId } = req.body;

        if (!reviewId) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const review = await Review.findByIdAndDelete(
            new mongoose.Types.ObjectId(reviewId)
        );

        if (!review) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while deleting review"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    review,
                    "Review deleted created successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while deleting review"));
    }
});

const getAllReviewOfProduct = asyncHandler(async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!product_id) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const review = await Review.find({product_id: new mongoose.Types.ObjectId(product_id)});

        if (!review) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while fetching review"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    review,
                    "Review fetched successfully",
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while fetching review"));
    }
});

export { createReview, updateReview, deleteReview, getAllReviewOfProduct };
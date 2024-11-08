import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        console.log(user)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating referesh and access token"
        );
    }
};

// resigter user

const registerUser = asyncHandler(async (req, res) => {
    try {
        // get data
        // validate data
        // check if user exist
        // create entry
        // validate
        // return response

        const { name, email, password, address, phone_number, accountType } =
            req.body;
        if (
            !name ||
            !email ||
            !password ||
            !address ||
            !phone_number ||
            !accountType
        ) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({
            email: email,
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist",
            });
        }

        const profileLocalPath = req?.file;
        let profile = null;
        if (profileLocalPath) {
            profile = await uploadOnCloudinary(profileLocalPath);
        }

        const user = await User.create({
            name,
            profile: profile !== null ? profile?.secure_url : "",
            email,
            password,
            address,
            phone_number,
            accountType,
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Error while creating user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error while registering user",
        });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        // get data
        // validate data
        // check if user exist
        // create entry
        // validate
        // return response

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({
            email: email,
        });
        const checkPassword = await user.isPasswordCorrect(password);

        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Wrong password",
            });
        }
        const { accessToken, refreshToken } = await Promise.resolve(
            generateAccessAndRefereshTokens(user._id)
        );
        const loggedinUser = await User.findById(user?._id).select(
            "-password -refreshToken"
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Error while creating user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User loggedin successfully",
            data: { user: loggedinUser, accessToken, refreshToken },
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error while logging in user",
        });
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;

        if (!id) {
            res.status(400).json({
                success: false,
                message: "Id is required",
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true,
            }
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);

        return res.status(200).json({
            success: true,
            message: "User loggedout successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error while logging out user",
        });
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const id = await req.user._id;

        const user = await User.findById(id);
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid password");
        }

        // change password
        user.password = newPassword;
        await user.save({ validateBeforeSave: false }); // now pre defined bcrypt function will run which is defined in the model and it will hash the password
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (e) {
        return res
            .status(500)
            .json(new ApiError(500, error?.message || "Internal server error"));
    }
});

export { registerUser, loginUser, logoutUser, changeCurrentPassword };
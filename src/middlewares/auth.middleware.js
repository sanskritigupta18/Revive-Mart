import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import JWT from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req,res,next) => {
    try {
        const accessToken = req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ","");
        if(!accessToken)
        {
            throw new ApiError(401,"Unauthorized request");
        }
        const decodedToken = JWT.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user)
        {
            throw new ApiError(401,"Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid token");
    }
})

export const verifyStore = asyncHandler(async(req,res,next) => {
    try {
        if(req?.user?.accountType !== "seller")
        {
            throw new ApiError(401,"Only sellers are allowed");
        }
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid token");
    }
})
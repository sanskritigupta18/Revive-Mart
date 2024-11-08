import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        profile: {
            type: String,
        },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        address: { type: String, required: true },
        phone_number: { type: String, required: true },
        accountType: {
            type: String,
            enum: ["admin", "customer", "seller"],
            default: "customer",
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            accountType: this.accountType,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);

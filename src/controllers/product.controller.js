import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Store } from "../models/store.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Order } from "../models/order.model.js";

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { storeId } = req.params;
        const {
            name,
            brand,
            category,
            price,
            description,
            colors,
            stock_quantity,
        } = req.body;
        if (
            (!name || !brand || !category || !price || !description || !colors,
            !stock_quantity)
        ) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const imageLocalPath = req?.file.path;
        if (!imageLocalPath) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Image file is requried"));
        }

        const store = await Store.findById(
            new mongoose.Types.ObjectId(storeId)
        );

        if (!store) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Store id is not valid"));
        }

        const uploadedImage = await uploadOnCloudinary(imageLocalPath);
        if (!uploadedImage) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while uploading image"));
        }

        const product = await Product.create({
            name,
            brand,
            category,
            price,
            description,
            colors,
            stock_quantity,
            image: uploadedImage?.secure_url,
        });

        const updatedStore = await Store.findByIdAndUpdate(
            store._id,
            {
                $push: {
                    products: product._id,
                },
            },
            {
                new: true,
            }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, product, "Product created suffessfully")
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while creating product"));
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    try {
        
        const {productId} = req.params;

        const {
            name,
            brand,
            category,
            price,
            description,
            stock_quantity,
        } = req.body;

        const product = await Product.findById(new mongoose.Types.ObjectId(productId));

        if(!product)
        {
            return res.status(500).json(new ApiResponse(500,{},"Error while fetching product"));
        }

        const updatedDetails = {};

        if(name)
        {
            updatedDetails.name = name;
        }

        if(brand)
        {
            updatedDetails.brand = brand;
        }

        if(category)
        {
            updatedDetails.category = category;
        }

        if(price)
        {
            updatedDetails.price = price;
        }

        if(description)
        {
            updatedDetails.description = description;
        }

        if(stock_quantity)
        {
            updatedDetails.stock_quantity = stock_quantity;
        }

        const updatedProduct = await Product.findByIdAndUpdate(product._id,updatedDetails,{new: true});

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedProduct, "Product updated suffessfully")
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while updating product"));
    }
});

const updateProductSoldOutStatus = asyncHandler(async (req,res) => {
    try
    {
        const {productId} = req.params;
        const {is_Sold} = req.body;

        if(!productId)
        {
            return res.status(400).json(new ApiResponse(400,{},"Product id is required"));
        }

        const product = await Product.findById(new mongoose.Types.ObjectId(productId));

        if(!product)
        {
            return res.status(500).json(new ApiResponse(500,{},"Product is not available"));
        }

        const updatedProduct = await Product.findByIdAndUpdate(product._id,{
            is_Sold: is_Sold,
        },{new: true});

        return res.status(200).json(new ApiResponse(200,updateProduct,"Product status updated successfully"));
    }
    catch(e)
    {
        return res.status(500).json(new ApiResponse(500,{},"Error while updating product status"));
    }
});

const deleteProduct = asyncHandler(async (req,res) => {
    try
    {
        const {productId} = req.body;

        if(!productId)
        {
            return res.status(400).json(new ApiResponse(400,{},"Product id is required"));
        }

        const product = await Product.findById(new mongoose.Types.ObjectId(productId));

        if(!product)
        {
            return res.status(500).json(new ApiResponse(500,{},"Product is not available"));
        }

        const updatedProduct = await Product.findByIdAndDelete(product._id,{new: true});

        return res.status(200).json(new ApiResponse(200,updatedProduct,"Product deleted successfully"));
    }
    catch(e)
    {
        return res.status(500).json(new ApiResponse(500,{},"Error while deleting product"));
    }
});

const getProductById = asyncHandler(async (req,res) => {
    try
    {
        const {productId} = req.params;
        if(!productId)
        {
            return res.status(400).json(new ApiResponse(400,{},"All fields are required"));
        }

        const product = await Product.findById(new mongoose.Types.ObjectId(productId));
        if(!product)
        {
            return res.status(500).json(new ApiResponse(500,{},"Error while fetching product details"));
        }

        return res.status(200).json(new ApiResponse(200,product,"Order details fetched successfully"));
    }
    catch(e)
    {
        return res.status(500).json(new ApiResponse(500,{},"Error while fetching details"));
    }
})

const searchProducts = asyncHandler(async (req,res) => {
    // Build the search query based on provided filters
    const { name, brand, category } = req.query;
    const query = {};

    // Add fields to the query object only if they are provided
    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (brand) {
        query.brand = { $regex: brand, $options: 'i' }; // Case-insensitive search
    }

    if (category) {
        query.category = { $regex: category, $options: 'i' }; // Case-insensitive search
    }

    try {
        // Find products based on the query
        const products = await Product.find(query);
        console.log(query)
        res.status(200).json(new ApiResponse(200,products,"Products fetched successfully"));
    } catch (error) {
        console.error("Error searching for products:", error);
        res.status(500).json(new ApiResponse(500,{},"Error while searching for product"));
    }
});

export { createProduct, updateProduct, updateProductSoldOutStatus, deleteProduct, searchProducts, getProductById };
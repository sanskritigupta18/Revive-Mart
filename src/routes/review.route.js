import express from 'express';
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createReview, updateReview, deleteReview, getAllReviewOfProduct } from '../controllers/review.controller.js';

const router = express.Router();

// Route to create a review
router.post('/create',verifyJWT, createReview);

// Route to update a review
router.patch('/update',verifyJWT, updateReview);

// Route to delete a review
router.delete('/delete',verifyJWT, deleteReview);

// Route to get all reviews of a product
router.get('/all',verifyJWT, getAllReviewOfProduct);

export default router;
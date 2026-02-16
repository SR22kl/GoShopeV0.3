import mongoose from "mongoose";
import { TryCatch } from "../middleware/error.js";
import { Review } from "../models/reviewModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/utilityClass.js";
import { invalidateCache } from "../utils/features.js";

// Create a new review
export const createReview = TryCatch(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const userId = req.query.id as string;

  console.log("Create Review Request:", { userId, productId, rating, comment });

  // Validate userId
  if (!userId || userId.trim() === "") {
    return next(new ErrorHandler("Please login to review", 401));
  }

  // Validate productId - must be valid MongoDB ObjectId
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  if (!rating || !comment) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new ErrorHandler("Rating must be between 1 and 5", 400));
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if user exists - userId is Firebase UID stored as string _id
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.error("Error finding user:", error);
    user = null;
  }

  if (!user) {
    console.log("User not found with ID:", userId);
    return next(new ErrorHandler("User not found", 401));
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
  });
  if (existingReview) {
    return next(
      new ErrorHandler("You have already reviewed this product", 400),
    );
  }

  // Create review
  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  // Fetch and populate user data
  const populatedReview = await Review.findById(review._id);
  const userdata = await User.findById(userId, "name photo");

  const responseReview = {
    ...review.toObject(),
    user: userdata,
  };

  invalidateCache({ product: true });

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    review: responseReview,
  });
});

// Get reviews for a product
export const getProductReviews = TryCatch(async (req, res, next) => {
  const { productId } = req.params;
  const { sort = "latest" } = req.query; // "latest" or "top"

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let sortOption: any = { createdAt: -1 }; // latest first
  if (sort === "top") {
    sortOption = { rating: -1, createdAt: -1 }; // highest rating first, then latest
  }

  const reviews = await Review.find({ product: productId }).sort(sortOption);

  // Fetch user data for each review
  const reviewsWithUsers = await Promise.all(
    reviews.map(async (review) => {
      const user = await User.findById(review.user, "name photo");
      return {
        ...review.toObject(),
        user,
      };
    }),
  );

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    reviews: reviewsWithUsers,
    totalReviews: reviews.length,
  });
});

// Get average rating for a product
export const getProductAverageRating = TryCatch(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  const stats = result[0] || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [],
  };

  // Calculate rating distribution
  const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
  stats.ratingDistribution.forEach((rating: number) => {
    distribution[rating - 1]++;
  });

  res.status(200).json({
    success: true,
    averageRating: Math.round(stats.averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: stats.totalReviews,
    ratingDistribution: distribution,
  });
});

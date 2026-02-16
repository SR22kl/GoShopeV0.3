import express from "express";
import { adminOnly } from "../middleware/auth.js";
import {
  createReview,
  getProductReviews,
  getProductAverageRating,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Routes
reviewRouter.post("/new", createReview); // POST /api/v1/review/new?id=userId
reviewRouter.get("/average/:productId", getProductAverageRating); // GET /api/v1/review/average/:productId (must be before /:productId)
reviewRouter.get("/:productId", getProductReviews); // GET /api/v1/review/:productId?sort=latest|top

export default reviewRouter;

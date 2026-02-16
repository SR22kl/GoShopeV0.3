import express from "express";
import {
  allCoupons,
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  newCoupon,
} from "../controllers/paymentController.js";
import { adminOnly } from "../middleware/auth.js";

const paymentRouter = express.Router();

// route - /api/v1/payment/create
paymentRouter.post("/create", createPaymentIntent);

// route - /api/v1/payment/discount
paymentRouter.get("/discount", applyDiscount);

// route - /api/v1/payment/coupon/new
paymentRouter.post("/coupon/new", adminOnly, newCoupon);

// route - /api/v1/payment/coupon/all
paymentRouter.get("/coupon/all", adminOnly, allCoupons);

// route - /api/v1/payment/coupon/:id
paymentRouter.delete("/coupon/:id", adminOnly, deleteCoupon);

export default paymentRouter;

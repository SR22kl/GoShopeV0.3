import { stripe } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utilityClass.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount)
    return next(new ErrorHandler("Please Enter Both Coupon & Amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  res.status(201).json({
    success: true,
    message: `Payment Intent Created Successfully`,
    clientSecret: paymentIntent.client_secret,
  });
});

export const newCoupon = TryCatch(async (req, res, next) => {
  const { code, amount } = req.body;

  if (!code || !amount)
    return next(new ErrorHandler("Please Enter Both Coupon & Amount", 400));

  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon) {
    return next(new ErrorHandler("Coupon code already exists", 400));
  }

  const newCoupon = await Coupon.create({ code, amount });

  await newCoupon.save();

  res.status(201).json({
    success: true,
    message: `Coupon With Code: ${code} Created Successfully`,
    coupon: newCoupon,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return next(new ErrorHandler("Please Enter A Coupon Code", 400));
  }

  const validCoupon = await Coupon.findOne({ code });

  if (!validCoupon) {
    return next(new ErrorHandler("Invalid Coupon Code", 400));
  }

  res.status(200).json({
    success: true,
    message: `${code} is valid, you received ${validCoupon.amount}Rs discount`,
    discount: validCoupon.amount,
  });
});

export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) {
    return next(new ErrorHandler("No Coupons found", 404));
  }

  res.status(200).json({
    success: true,
    message: "All Coupons fetched successfully!",
    count: coupons.length,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    return next(new ErrorHandler("Invalid ID", 404));
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: `Coupon with id: ${id} deleted successfully`,
    coupon,
  });
});

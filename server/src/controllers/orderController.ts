import { Request } from "express";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/orderModel.js";
import { NewOrderRequestBody } from "../types/types.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utilityClass.js";
import { myCache } from "../app.js";

export const myOrder = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = `my-orders-${user}`;

  let orders = [];

  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find({ user });
    myCache.set(key, JSON.stringify(orders));
  }

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully!",
    totalOrders: orders.length,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = "allOrders";
  let orders = [];

  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find({}).populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }

  res.status(200).json({
    success: true,
    message: "All Orders fetched successfully!",
    orders,
  });
});

export const orderDetails = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order-${id}`;

  let order;

  if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");

    if (!order)
      return next(new ErrorHandler(`Order with id:${id} not found!`, 404));

    myCache.set(key, JSON.stringify(order));
  }

  res.status(200).json({
    success: true,
    message: "Order Details Fetch Successfully!",
    order,
  });
});

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      status,
    } = req.body;

    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subtotal ||
      !tax ||
      shippingCharges === undefined || // Corrected check
      shippingCharges === null || // Corrected check
      discount === undefined || // Corrected check
      discount === null || // Corrected check
      !total ||
      !status
    ) {
      return next(new ErrorHandler("Please Enter All Fields", 400));
    }

    const order = await Order.create({
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      status,
      orderItems,
    });

    await reduceStock(orderItems);

    console.log("User ID in newOrder:", user);

    // await InvalidateCache(user, undefined, true, true);

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
      // productId: order.orderItems.map((i) => i.productId).toString(),
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully!",
      order,
    });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user"); // Populate user

  if (!order) return next(new ErrorHandler("Order not found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  console.log("User ID in processOrder:", order.user);

  // await InvalidateCache(order.user, id, true, false);

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  res.status(201).json({
    success: true,
    message: "Order Processed Successfully!",
    order,
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user"); // Populate user
  if (!order) return next(new ErrorHandler("Order not found", 404));
  await order.deleteOne();

  console.log("User ID in deleteOrder:", order.user);

  // await InvalidateCache(order.user, id, true, false); // Invalidate only order cache

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  res.status(201).json({
    success: true,
    message: "Order Deleted Successfully!",
  });
});

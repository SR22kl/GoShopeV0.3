import express from "express";
import {
  allOrders,
  deleteOrder,
  myOrder,
  newOrder,
  orderDetails,
  processOrder,
} from "../controllers/orderController.js";
import { adminOnly } from "../middleware/auth.js";

const orderRouter = express.Router();

// route - /api/v1/order/new
orderRouter.post("/new", newOrder);

// route - /api/v1/order/my
orderRouter.get("/my", myOrder);

// route - /api/v1/order/all
orderRouter.get("/all", adminOnly, allOrders);

orderRouter
  .route("/:id")
  .get(orderDetails)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default orderRouter;

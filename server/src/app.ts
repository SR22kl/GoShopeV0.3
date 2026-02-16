import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middleware/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";

// Import routes
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import statsRouter from "./routes/statsRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

config({
  path: "./.env",
});

const PORT = process.env.PORT || 4000;

// Connect to MongoDB Compass
const mongoUri = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";
connectDB(mongoUri);

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//stripe
export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();

// Enable cors
app.use(cors());

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// To get the request made in terminal
app.use(morgan("dev"));

// Routes
app.get("/test", (req, res) => {
  res.send("test api working ");
});

app.get("/", (req, res) => {
  res.send("Api Working with /api/v1 ");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/dashboard", statsRouter);
app.use("/api/v1/review", reviewRouter);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

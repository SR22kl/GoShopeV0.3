import mongoose from "mongoose";
import { trim } from "validator";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
    },
    photos: [
      {
        public_id: {
          type: String,
          required: [true, "Please Enter Product Image Public ID"],
        },
        url: {
          type: String,
          required: [true, "Please Enter Product Image URL"],
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "Please Enter Product Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Product Stock"],
    },
    category: {
      type: String,
      required: [true, "Please Enter Product Category"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter Product Description"],
    },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model("Product", schema);

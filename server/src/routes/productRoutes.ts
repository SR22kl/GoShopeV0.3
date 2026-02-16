import express from "express";

import { adminOnly } from "../middleware/auth.js";
import {
  deleteProduct,
  getadminProducts,
  getlatestProducts,
  getproductCategories,
  getproductDetails,
  newProduct,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";
import { multipleUpload } from "../middleware/multer.js";

const productRouter = express.Router();

// route - /api/v1/product/new
productRouter.post("/new", adminOnly, multipleUpload, newProduct);

// route - /api/v1/product/all
productRouter.get("/all", searchProducts);

// route - /api/v1/product/latest
productRouter.get("/latest", getlatestProducts);

// route - /api/v1/product/categories
productRouter.get("/categories", getproductCategories);

// route - /api/v1/product/admin-products
productRouter.get("/admin-products", adminOnly, getadminProducts);

// route - /api/v1/product/:id =>produtDeatils update & delete products
productRouter
  .route("/:id")
  .get(getproductDetails)
  .put(adminOnly, multipleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default productRouter;

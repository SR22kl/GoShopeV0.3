import { NextFunction, Request, Response } from "express";
import { rm } from "fs";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/productModel.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import ErrorHandler from "../utils/utilityClass.js";
// import { faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import {
  deleteFromCloudinary,
  invalidateCache,
  uploadToCloudinary,
} from "../utils/features.js";
// import { count } from "console";

export const searchProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    //2:54:33
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    // const products = await Product.find(baseQuery)
    //   .sort(sort && { price: sort === "asc" ? 1 : -1 })
    //   .limit(limit)
    //   .skip(skip);

    // const filteredProduct = await Product.find(baseQuery);

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredProduct.length / limit);

    res.status(200).json({
      success: true,
      message: `Search Products Data Fetch Successfully`,
      totalPage,
      currentPage: page,
      totalItems: products.length,
      products,
    });
  },
);

//Revalidate on New, Upadate Deleting product & on New Order
export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products = [];

  if (myCache.has("latestProducts"))
    products = JSON.parse(myCache.get("latestProducts") as string);
  else {
    products = await Product.find({})
      .sort({
        createdAt: -1,
      })
      .limit(5);

    myCache.set("latestProducts", JSON.stringify(products));
  }

  res.status(200).json({
    success: true,
    message: "Latest product fetched successfully",
    count: products.length,
    products,
  });
});

//Revalidate on New, Upadate Deleting product & on New Order
export const getproductCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  res.status(200).json({
    success: true,
    message: `Categories Fetched Successfully`,
    categories,
  });
});

//Revalidate on New, Upadate Deleting product & on New Order
export const getadminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("adminProducts"))
    products = JSON.parse(myCache.get("adminProducts") as string);
  else {
    products = await Product.find({});
    myCache.set("adminProducts", JSON.stringify(products));
  }

  res.status(200).json({
    success: true,
    message: `Products Fetched Successfully`,
    products,
  });
});

export const getproductDetails = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;

  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);
    if (!product)
      return next(new ErrorHandler(`Product with id:${id} not found!`, 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  res.status(200).json({
    success: true,
    message: `Product Details Fetch Successfully`,
    product,
  });
});

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction,
  ) => {
    console.log("newProduct called");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    const { name, price, stock, category, description } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;
    const photos = files?.filter((file) => file.fieldname === "photos") || [];
    console.log("photos:", photos);

    if (!photos) {
      return next(new ErrorHandler("Please add a product photo", 400));
    }

    if (photos.length < 1) {
      return next(
        new ErrorHandler("Please add at least one product photo", 400),
      );
    }

    if (photos.length > 5) {
      return next(new ErrorHandler("You can upload only 5 Photos", 400));
    }

    if (!name || !price || !stock || !category || !description) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    //upload photos to cloudinary
    const photosURL = await uploadToCloudinary(photos);

    await Product.create({
      name,
      photos: photosURL,
      price,
      description,
      stock,
      category: category.toLowerCase(),
    });

    invalidateCache({ product: true, admin: true });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  },
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description, ratings } = req.body;
  const files = req.files as Express.Multer.File[] | undefined;
  const photos = files?.filter((file) => file.fieldname === "photos") || [];

  const product = await Product.findById(id);

  if (!product)
    return next(new ErrorHandler(`Product with id:${id} not found!`, 404));

  if (photos && photos.length > 0) {
    const photosURL = await uploadToCloudinary(photos);

    const ids = product.photos.map((photo) => photo.public_id);

    await deleteFromCloudinary(ids);

    product.$set("photos", photosURL);
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category.toLowerCase();
  if (description) product.description = description;

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  res.status(201).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product)
    return next(new ErrorHandler(`Product with id:${id} not found!`, 404));

  rm(product.photos[0].url!, () => {
    console.log("Product Photo Deleted Successfully");
  });

  await product.deleteOne();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  res.status(200).json({
    success: true,
    message: `Product with id:${id} deleted successfully`,
  });
});

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\1739876022104-Nintendo-Switch.jpg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

//generateRandomProducts(20)

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(3);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };
// deleteRandomsProducts(77)

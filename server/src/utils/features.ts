import mongoose, { Document } from "mongoose";
import { invalidateCacheProps, orderItemsType } from "../types/types.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

import { myCache } from "../app.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "Ecom24xs",
    })
    .then((c) => {
      console.log(`DB connected to ${c.connection.host}`);
    })
    .catch((err) => {
      console.log(`Error connecting to DB: ${err}`);
    });
};

// export const InvalidateCache = async (
//   userId?: string,
//   orderId?: string,
//   order?: boolean,
//   product?: boolean
// ) => {
//   try {
//     if (product) {
//       const productKeys: string[] = [
//         "latestProducts",
//         "categories",
//         "adminProducts",
//       ];
//       const products = await Product.find({}).select("_id");

//       products.forEach((i) => {
//         productKeys.push(`product-${i._id}`);
//       });

//       myCache.del(productKeys);
//     }
//     if (order) {
//       // Invalidate order related cache
//       const orderKeys: string[] = ["allOrders"];
//       if (userId) {
//         orderKeys.push(`my-orders-${userId}`);
//       }
//       if (orderId) {
//         orderKeys.push(`order-${orderId}`);
//       }
//       // Invalidate all order related cache
//       const orders = await Order.find({}).select("_id");

//       orders.forEach((i) => {
//         orderKeys.push(`order-${i._id}`);
//       });

//       console.log("Deleting order cache keys:", orderKeys);

//       myCache.del(orderKeys);
//     }
//   } catch (error) {
//     console.error("Error invalidating cache:", error);
//   }
// };

const getBase64 = (file: Express.Multer.File) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
  const promises = files.map(async (file) => {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(getBase64(file), (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      });
    });
  });

  const result = await Promise.all(promises);

  return result.map((i) => ({
    public_id: i.public_id,
    url: i.secure_url,
  }));
};

export const deleteFromCloudinary = async (public_ids: string[]) => {
  const promises = public_ids.map((id) => {
    return new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(id, (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      });
    });
  });
  await Promise.all(promises);
};

export const invalidateCache = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: invalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latestProducts",
      "categories",
      "adminProducts",
    ];
    // `product-${id}`

    if (typeof productId === "string") {
      productKeys.push(`product-${productId}`);
    }
    if (typeof productId === "object") {
      productId.forEach((id) => {
        productKeys.push(`product-${id}`);
        // console.log("working with product");
      });
    }

    myCache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = [
      "allOrders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    console.log("Deleting order cache keys:", orderKeys);

    myCache.del(orderKeys);
  }

  if (admin) {
    myCache.del([
      "admin-stats",
      "AdminPieChart",
      "AdminBarChart",
      "AdminLineChart",
    ]);
  }
};

export const reduceStock = async (orderItems: orderItemsType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error(`Product with id ${order.productId} not found`);
    }
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category }),
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoriesCountData: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoriesCountData.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoriesCountData;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number | null;
  total?: number;
}

type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });
  return data;
};

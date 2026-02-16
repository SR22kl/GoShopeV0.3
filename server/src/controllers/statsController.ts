import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import {
  calculatePercentage,
  getChartData,
  getInventories,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};
  const key = "admin-stats";

  if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();

    const sixMontsAgo = new Date();
    sixMontsAgo.setMonth(sixMontsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUserPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUserPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMontsAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .limit(5)
      .sort("-createdAt");

    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUsersCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUserPromise,
      thisMonthOrderPromise,
      lastMonthProductsPromise,
      lastMonthUserPromise,
      lastMonthOrderPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      users: usersCount,
      products: productsCount,
      orders: allOrders.length,
    };

    const orderMonthCount = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCount[6 - monthDiff - 1] += 1;
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total || 0;
      }
    });

    //using getChartData👇

    // const orderMonthCount = getChartData({
    //   length: 12,
    //   today,
    //   docArr: lastSixMonthOrders,
    // });
    // const orderMonthlyRevenue = getChartData({
    //   length: 6,
    //   today,
    //   docArr: lastSixMonthOrders,
    //   property: "total",
    // });

    const categoriesCountData = await getInventories({
      categories,
      productsCount,
    });

    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    const genderRatioPercent = {
      femaleUsers: Math.round((femaleUsersCount / usersCount) * 100),
      maleUsers: 100 - Math.round((femaleUsersCount / usersCount) * 100),
    };

    const modifiedLatestTransations = latestTransactions.map((i) => ({
      _id: i._id,
      name: i.orderItems[0].name,
      discount: i.discount,
      total: i.total,
      quantity: i.orderItems[0].quantity,
      status: i.status,
    }));

    stats = {
      categoriesCountData,
      changePercent,
      count,
      chart: {
        order: orderMonthCount,
        revenue: orderMonthlyRevenue,
      },
      userRatio,
      genderRatioPercent,
      latestTransactions: modifiedLatestTransations,
    };

    myCache.set(key, JSON.stringify(stats));
  }

  res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "AdminPieChart";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const allOrdersPromise = Order.find({}).select([
      "total",
      "subtotal",
      "tax",
      "discount",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      OutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrdersPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    const categoriesCountData = await getInventories({
      categories,
      productsCount,
    });

    const stockAvailablity = {
      inStock: productsCount - OutOfStock,
      OutOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - productionCost - discount - burnt - marketingCost;

    const revenueDistribution = {
      grossIncome,
      productionCost,
      discount,
      burnt,
      marketingCost,
      netMargin,
    };

    const usersAgeGroup = {
      Teen: allUsers.filter((user) => user.age < 20).length,
      Adult: allUsers.filter((user) => user.age >= 20 && user.age <= 60).length,
      Senior: allUsers.filter((user) => user.age >= 61).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productsCategories: categoriesCountData,
      stockAvailablity,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  res.status(200).json({
    success: true,
    message: "Pie-Charts data fetched successfully",
    charts,
  });
});

export const getBarCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "AdminBarChart";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();

    const sixMontsAgo = new Date();
    sixMontsAgo.setMonth(sixMontsAgo.getMonth() - 6);

    const twelveMontsAgo = new Date();
    twelveMontsAgo.setMonth(twelveMontsAgo.getMonth() - 12);

    const SixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMontsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const SixMonthUserPromise = User.find({
      createdAt: {
        $gte: sixMontsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const TwelveMonthOrderPromise = Order.find({
      createdAt: {
        $gte: twelveMontsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      SixMonthProductPromise,
      SixMonthUserPromise,
      TwelveMonthOrderPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const userCounts = getChartData({ length: 6, today, docArr: users });
    const orderCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: userCounts,
      products: productCounts,
      orders: orderCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  }
  res.status(200).json({
    success: true,
    message: "Bar-Charts data fetched successfully",
    charts,
  });
});

export const getLineCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "AdminLineChart";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();

    const twelveMontsAgo = new Date();
    twelveMontsAgo.setMonth(twelveMontsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMontsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const userCounts = getChartData({ length: 12, today, docArr: users });

    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });

    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: userCounts,
      products: productCounts,
      discount,
      revenue,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  res.status(200).json({
    success: true,
    message: "Line-Charts data fetched successfully",
    charts,
  });
});

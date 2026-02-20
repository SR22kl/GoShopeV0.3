import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { motion } from "framer-motion";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { RootState } from "../redux/store";
import { CustomError } from "../types/apiTypes";

// ---------------- Types ----------------

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

// Table Columns

const column: Column<DataType>[] = [
  { Header: "Order ID", accessor: "_id" },
  { Header: "Items", accessor: "quantity" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Total", accessor: "amount" },
  { Header: "Status", accessor: "status" },
  { Header: "", accessor: "action" },
];

console.log(column)

// Animations 

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

// Component

const Orders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isError, isLoading, error } = useMyOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.orders.map((i) => ({
          _id: i._id.slice(-8),
          amount: i.total,
          quantity: i.orderItems.length,
          discount: i.discount,
          status: (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                i.status === "Processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : i.status === "Shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {i.status}
            </span>
          ),
          action: (
            <Link
              to={`/order/${i._id}`}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-black hover:text-white transition"
            >
              View
            </Link>
          ),
        }))
      );
  }, [data]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <span className="text-sm text-gray-500">{rows.length} Orders</span>
      </motion.div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {rows.map((order, index) => (
            <motion.div key={index} variants={item}>
              <div className="rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col gap-4">
                {/* Top */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">#{order._id}</h3>
                  {order.status}
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">Items</p>
                    <p>{order.quantity}</p>
                  </div>

                  <div>
                    <p className="font-medium">Discount</p>
                    <p>₹{order.discount}</p>
                  </div>

                  <div>
                    <p className="font-medium">Total</p>
                    <p className="font-semibold text-black">
                      ₹{order.amount}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-end">{order.action}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Orders;
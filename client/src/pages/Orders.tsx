import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { RootState } from "../redux/store";
import { CustomError } from "../types/apiTypes";

//Types

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

//Animations

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

//Component

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
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/40 ${
                i.status === "Processing"
                  ? "bg-yellow-200/40 text-yellow-800"
                  : i.status === "Shipped"
                  ? "bg-blue-200/40 text-blue-800"
                  : "bg-green-200/40 text-green-800"
              }`}
            >
              {i.status}
            </span>
          ),
          action: (
            <Link
              to={`/order/${i._id}`}
              className="px-4 py-1.5 text-sm rounded-lg bg-white/40 backdrop-blur-md border border-white/50 hover:bg-black hover:text-white transition-all duration-300"
            >
              View
            </Link>
          ),
        }))
      );
  }, [data]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-100 relative overflow-hidden">
      
      {/* Glow blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-400 rounded-full blur-3xl opacity-30" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 relative z-10"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          My Orders
        </h1>
        <span className="text-sm text-gray-700 font-medium">
          {rows.length} Orders
        </span>
      </motion.div>

      {/* Loading */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-white/40 backdrop-blur-md animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {rows.map((order, index) => (
            <motion.div key={index} variants={item}>
              <div
                className="rounded-2xl 
                backdrop-blur-xl 
                bg-white/30 
                border border-white/40 
                shadow-lg 
                hover:shadow-2xl 
                hover:scale-[1.03] 
                transition-all duration-500 
                p-6 flex flex-col gap-4 
                relative overflow-hidden"
              >
                {/* Glossy shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 hover:opacity-100 transition duration-700 rotate-12 translate-x-[-100%] hover:translate-x-[200%]" />

                {/* Top */}
                <div className="flex justify-between items-center relative z-10">
                  <h3 className="font-semibold text-lg text-gray-800">
                    #{order._id}
                  </h3>
                  {order.status}
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-3 text-sm text-gray-700 relative z-10">
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
                    <p className="font-semibold text-gray-900">
                      ₹{order.amount}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-end relative z-10">
                  {order.action}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Orders;
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderDetailsQuery } from "../redux/api/orderApi";
import { CustomError } from "../types/apiTypes";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useOrderDetailsQuery(id!);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const order = data?.order!;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Shipped":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Delivered":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-200 p-6">
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : order ? (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Order Details
            </h1>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Shipping */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-lg mb-4">
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <strong>Address:</strong> {order.shippingInfo.address}
                  </p>
                  <p>
                    <strong>City:</strong> {order.shippingInfo.city}
                  </p>
                  <p>
                    <strong>State:</strong> {order.shippingInfo.state}
                  </p>
                  <p>
                    <strong>Country:</strong> {order.shippingInfo.country}
                  </p>
                  <p>
                    <strong>PIN:</strong> {order.shippingInfo.pinCode}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-lg mb-4">Items</h2>

                <div className="flex flex-col gap-4">
                  {order.orderItems.map((item, i) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 items-center border rounded-xl p-3 hover:shadow-md transition"
                    >
                      <img
                        src={`${item.photo}`}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                      />

                      <div className="flex flex-col flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">₹{item.price}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Order Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-lg mb-4">Order Info</h2>

                <div className="text-sm flex flex-col gap-2">
                  <p>
                    <strong>ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Name:</strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt!).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Updated:</strong>{" "}
                    {new Date(order.updatedAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-lg mb-4">Summary</h2>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{order.tax}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{order.shippingCharges}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>₹{order.discount}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-base mt-2 border-t pt-2">
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <p>Order not found</p>
      )}
    </div>
  );
};

export default OrderDetails;
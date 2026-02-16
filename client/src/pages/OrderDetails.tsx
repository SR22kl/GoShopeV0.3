import { useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../redux/api/orderApi";
import { CustomError } from "../types/apiTypes";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { server } from "../redux/store";

const OrderDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useOrderDetailsQuery(id!);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const order = data?.order!;

  console.log(order);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Shipped":
        return "bg-green-500";
      case "Processing":
        return "bg-yellow-500";
      case "Delivered":
        return "bg-blue-500";
      default:
        "Shipped";
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {isLoading ? (
        <Skeleton
          className="skeleton w-full h-[35rem] rounded-lg "
          flex="flex flex-row gap-3 p-12 justify-center items-center "
          length={1}
        />
      ) : order ? (
        <>
          <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Order Details
          </h1>

          <div className="flex flex-col w-full md:w-[50rem] p-4 bg-blue-100 rounded-md shadow-lg">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                Shipping Information
              </h2>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">Address:</strong>{" "}
                <span>{order.shippingInfo.address}</span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">City:</strong>{" "}
                <span>{order.shippingInfo.city}</span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">State:</strong>{" "}
                <span>{order.shippingInfo.state}</span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">Country:</strong>{" "}
                <span>{order.shippingInfo.country}</span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">PIN Code:</strong>{" "}
                <span>{order.shippingInfo.pinCode}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                Order Information
              </h2>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">Order ID:</strong>{" "}
                <span>{order._id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">Customer Name:</strong>{" "}
                <span>{order.user.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">Order Status:</strong>{" "}
                <span
                  className={`text-white px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">Order Date:</strong>{" "}
                <span>
                  {new Date(order.createdAt!).toLocaleDateString() || ""}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <strong className="text-gray-600">Last Updated:</strong>{" "}
                <span>
                  {new Date(order.updatedAt!).toLocaleDateString() || ""}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                Order Items
              </h2>
              <ul className="space-y-4">
                {order.orderItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center border-b pb-4"
                  >
                    <img
                      src={`${server}/${item.photo}`}
                      alt={item.name}
                      className="w-20 h-20 object-contain mr-4 rounded-md"
                    />
                    <div className="flex-grow">
                      <strong className="block text-gray-700">
                        {item.name}
                      </strong>
                      <span className="text-gray-600">
                        Quantity: {item.quantity}
                      </span>
                      <span className="text-gray-600">
                        Price: ₹{item.price}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                Order Summary
              </h2>
              <div className="text-right">
                <p className="mb-1">
                  <strong className="text-gray-600">Subtotal:</strong> ₹
                  {order.subtotal}
                </p>
                <p className="mb-1">
                  <strong className="text-gray-600">Tax:</strong> ₹{order.tax}
                </p>
                <p className="mb-1">
                  <strong className="text-gray-600">Shipping Charges:</strong> ₹
                  {order.shippingCharges}
                </p>
                <p className="mb-1">
                  <strong className="text-gray-600">Discount:</strong> ₹
                  {order.discount}
                </p>
                <p className="text-lg font-semibold">
                  <strong className="text-gray-600">Total:</strong> ₹
                  {order.total}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Order not found.</p>
      )}
    </div>
  );
};

export default OrderDetails;

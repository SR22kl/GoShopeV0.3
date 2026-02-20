import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Skeleton } from "../../components/Loader";
import { useAllOrdersQuery } from "../../redux/api/orderApi";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/apiTypes";
import { motion } from "framer-motion";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "User", accessor: "user" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Qty", accessor: "quantity" },
  { Header: "Status", accessor: "status" },
  { Header: "Action", accessor: "action" },
];

// animations
const tableAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const Transaction = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isError, isLoading, error } = useAllOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  // ✅ FIXED toast
  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  // ✅ Safe rows
  useEffect(() => {
    if (!data?.orders) return;

    const updatedRows: DataType[] = data.orders.map((i) => ({
      user: i.user.name,
      amount: i.total,
      discount: i.discount,
      status: (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            i.status === "Processing"
              ? "bg-yellow-100 text-yellow-700"
              : i.status === "Shipped"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {i.status}
        </span>
      ),
      quantity: i.orderItems.length,
      action: (
        <Link
          to={`/admin/transaction/${i._id}`}
          className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
        >
          Manage
        </Link>
      ),
    }));

    setRows(updatedRows);
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-2xl font-bold">Transactions</h1>
          <span className="text-sm text-gray-500">{rows.length} Orders</span>
        </motion.div>

        {isLoading ? (
          <Skeleton
            length={10}
            flex="flex flex-col gap-2"
            className="skeleton w-full h-12"
          />
        ) : (
          <motion.div
            variants={tableAnim}
            initial="hidden"
            animate="show"
            className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
          >
            <table className="w-full table-auto text-[12px] md:text-[15px]">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.Header)}
                      className="px-3 py-3 sm:px-5 text-left font-semibold text-gray-700 whitespace-nowrap"
                    >
                      {typeof column.Header === "string"
                        ? column.Header
                        : null}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <motion.tr
                    key={index}
                    variants={rowAnim}
                    className="border-b border-gray-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-3 py-3 sm:px-5 whitespace-nowrap">
                      {row.user}
                    </td>
                    <td className="px-3 py-3 sm:px-5 whitespace-nowrap font-medium">
                      ₹{row.amount}
                    </td>
                    <td className="px-3 py-3 sm:px-5 whitespace-nowrap">
                      ₹{row.discount}
                    </td>
                    <td className="px-3 py-3 sm:px-5 whitespace-nowrap">
                      {row.quantity}
                    </td>
                    <td className="px-3 py-3 sm:px-5 whitespace-nowrap">
                      {row.status}
                    </td>
                    <td className="px-3 py-3 sm:px-5 whitespace-nowrap">
                      {row.action}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Transaction;
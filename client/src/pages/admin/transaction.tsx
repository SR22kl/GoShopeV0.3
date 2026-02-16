import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllOrdersQuery } from "../../redux/api/orderApi";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/apiTypes";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "User",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Qty",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isError, isLoading, error } = useAllOrdersQuery(user?._id!);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data)
      setRows(
        data.orders.map((i) => ({
          user: i.user.name,
          amount: i.total,
          discount: i.discount,
          status: (
            <span
              className={`text-[11px] md:text-[15px] font-semibold ${
                i.status === "Processing"
                  ? "text-red-500"
                  : i.status === "Shipped"
                  ? "text-purple-500"
                  : "text-green-500"
              }`}
            >
              {i.status}
            </span>
          ),
          quantity: i.orderItems.length,
          action: (
            <Link
              to={`/admin/transaction/${i._id}`}
              className="text-indigo-600 hover:text-indigo-800 text-[11px] md:text-[15px]"
            >
              Manage
            </Link>
          ),
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "bg-white shadow-md rounded-md overflow-x-auto",
    "Transactions",
    rows.length > 6
  )();

  console.log(Table);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="p-4 sm:p-6">
        {isLoading ? (
          <Skeleton
            length={10}
            flex="flex flex-col gap-2"
            className="skeleton w-full h-12"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-200 sticky top-0 z-10 text-[11px] md:text-[15px]">
                <tr>
                  <th className="px-2 py-2 sm:px-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                    User
                  </th>
                  <th className="px-2 py-2 sm:px-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-2 py-2 sm:px-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Discount
                  </th>
                  <th className="px-2 py-2 sm:px-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Qty
                  </th>
                  <th className="px-2 py-2 sm:px-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-2 py-2 sm:px-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 text-[12px] md:text-[15px] ${
                      index % 2 === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="px-2 py-2 sm:px-4 whitespace-nowrap">
                      {row.user}
                    </td>
                    <td className="px-2 py-2 sm:px-4 whitespace-nowrap">
                      {row.amount}
                    </td>
                    <td className="px-2 py-2 sm:px-4 whitespace-nowrap">
                      {row.discount}
                    </td>
                    <td className="px-2 py-2 sm:px-4 whitespace-nowrap">
                      {row.quantity}
                    </td>
                    <td className="px-2 py-2 sm:px-4 whitespace-nowrap">
                      {row.status}
                    </td>
                    <td className="px-2 py-2 sm:px-4 whitespace-nowrap ">
                      <button className="p-1 md:p-1.5 rounded-md shadow-lg bg-green-200">
                        {row.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Transaction;

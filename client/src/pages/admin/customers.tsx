import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApi";
import { CustomError } from "../../types/apiTypes";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";
import { responseToast } from "../../utils/features";
import { motion } from "framer-motion";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Avatar", accessor: "avatar" },
  { Header: "Name", accessor: "name" },
  { Header: "Gender", accessor: "gender" },
  { Header: "Email", accessor: "email" },
  { Header: "Role", accessor: "role" },
  { Header: "Action", accessor: "action" },
];

const UserImg = "../../assets/userIcon.png";

// animations
const tableAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useAllUsersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id! });
    if (res.data?.success) responseToast(res, null, "");
  };

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (!data?.users) return;

    const updatedRows: DataType[] = data.users.map((i) => ({
      avatar: (
        <img
          className="rounded-full w-9 h-9 object-cover border border-gray-200 shadow-sm"
          src={i.photo || UserImg}
          alt={i.name}
        />
      ),
      name: i.name,
      email: i.email,
      gender: i.gender,
      role: (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            i.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {i.role}
        </span>
      ),
      action: (
        <button
          className="p-2 rounded-md text-red-500 hover:bg-red-500 hover:text-white transition"
          onClick={() => deleteHandler(i._id)}
        >
          <FaTrash className="w-4 h-4" />
        </button>
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
          <h1 className="text-2xl font-bold">Customers</h1>
          <span className="text-sm text-gray-500">{rows.length} Users</span>
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
                    {columns.map((column) => (
                      <td
                        key={String(column.accessor)}
                        className="px-3 py-3 sm:px-5 whitespace-nowrap"
                      >
                        {column.accessor === "email" ? (
                          <span className="block sm:hidden">
                            {row.email.length > 10
                              ? `${row.email.slice(0, 10)}...`
                              : row.email}
                          </span>
                        ) : (
                          row[column.accessor as keyof DataType]
                        )}

                        {column.accessor === "email" && (
                          <span className="hidden sm:block">{row.email}</span>
                        )}
                      </td>
                    ))}
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

export default Customers;
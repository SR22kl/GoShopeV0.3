import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
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

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const UserImg = "../../assets/userIcon.png";

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useAllUsersQuery(user?._id!);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const [rows, setRows] = useState<DataType[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id! });

    if (res.data?.success) {
      responseToast(res, null, "");
    }
  };

  useEffect(() => {
    if (data)
      setRows(
        data.users.map((i) => ({
          avatar: (
            <img
              className="rounded-full w-8 h-8 object-cover"
              src={i.photo || UserImg}
              alt={i.name}
            />
          ),
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button
              className="bg-transparent border-none text-red-500 cursor-pointer p-1 text-sm"
              onClick={() => deleteHandler(i._id)}
            >
              <FaTrash className="w-4 h-4" />
            </button>
          ),
        })),
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "bg-white shadow-md rounded-md overflow-x-auto", // Container for the table
    "Customers",
    rows.length > 6,
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
            {/*horizontal scroll for the table */}
            <table className="w-full table-auto text-[12px] md:text-[15px]">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={
                        typeof column.Header === "string" ||
                        typeof column.Header === "number"
                          ? column.Header
                          : String(column.Header)
                      }
                      className="px-2 py-2 sm:px-4 text-left font-semibold text-gray-700 whitespace-nowrap"
                    >
                      {typeof column.Header === "string" ||
                      typeof column.Header === "number"
                        ? column.Header
                        : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.accessor)}
                        className="px-2 py-2 sm:px-4 whitespace-nowrap"
                      >
                        {column.accessor === "email" ? (
                          <span className="block sm:hidden">
                            {row.email.length > 8
                              ? `${row.email.slice(0, 8)}...`
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

export default Customers;

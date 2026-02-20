import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productApi";
import toast from "react-hot-toast";
import { CustomError } from "../../types/apiTypes";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducerTypes";
import { Skeleton } from "../../components/Loader";
import { motion } from "framer-motion";

interface DataType {
  photo: ReactElement;
  name: string;
  stock: number;
  price: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Photo", accessor: "photo" },
  { Header: "Name", accessor: "name" },
  { Header: "Price", accessor: "price" },
  { Header: "Stock", accessor: "stock" },
  { Header: "Action", accessor: "action" },
];

const Products = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { data, isError, error, isLoading } = useAllProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (!data?.products) return;

    const updatedRows: DataType[] = data.products.map((i) => ({
      photo: (
        <img
          src={`${i.photos[0]?.url}`}
          alt={i.name}
          className="w-12 h-12 object-cover rounded-md"
        />
      ),
      name: i.name,
      price: i.price,
      stock: i.stock,
      action: (
        <Link
          to={`/admin/product/${i._id}`}
          className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
        >
          Manage
        </Link>
      ),
    }));

    setRows(updatedRows);
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden",
    "",
    rows.length > 6
  )();

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
          <h1 className="text-2xl font-bold">Products</h1>
          <span className="text-sm text-gray-500">{rows.length} Items</span>
        </motion.div>

        {isLoading ? (
          <Skeleton
            length={10}
            flex="flex flex-col gap-2"
            className="w-full h-[3rem]"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl overflow-hidden"
          >
            {Table}
          </motion.div>
        )}
      </main>

      {/* Floating Add Button */}
      <Link
        to="/admin/product/new"
        className="fixed bottom-5 right-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition hover:scale-110"
      >
        <FaPlus className="duration-300 hover:rotate-180" />
      </Link>
    </div>
  );
};

export default Products;
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

interface DataType {
  photo: ReactElement;
  name: string;
  stock: number;
  price: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { data, isError, error, isLoading } = useAllProductsQuery(user?._id!);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data)
      setRows(
        data.products.map((i) => ({
          key: i._id,
          photo: <img src={`${i.photos[0]?.url}`} alt="Shoes" />,
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main>
        {isLoading ? (
          <Skeleton
            length={10}
            flex="flex flex-col gap-2 mt-4"
            className="skeleton w-full h-[3rem] "
          />
        ) : (
          Table
        )}
      </main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus className="duration-300 ease-in-out hover:rotate-180" />
      </Link>
    </div>
  );
};

export default Products;

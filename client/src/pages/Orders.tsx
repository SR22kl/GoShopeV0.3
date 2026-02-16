import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { Skeleton } from "../components/Loader";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { RootState } from "../redux/store";
import { CustomError } from "../types/apiTypes";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
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

const Orders = () => {
  // const { user } = useSelector(
  //   (state: { userReducer: UserReducerInitialState }) => state.userReducer
  // );👇

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
          _id: i._id,
          amount: i.total,
          quantity: i.orderItems.length,
          discount: i.discount,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "pruple"
                  : "green"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/order/${i._id}`}>View</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();
  return (
    <>
      <div id="container">
        <h1>My Orders</h1>
        <main>
          {isLoading ? (
            <Skeleton
              length={10}
              flex="flex flex-col gap-2"
              className="skeleton w-full h-[3rem]"
            />
          ) : (
            Table
          )}
        </main>
      </div>
    </>
  );
};

export default Orders;

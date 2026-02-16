import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { server } from "../../../redux/store";
import { Order, OrderItem } from "../../../types/types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useProcessOrderMutation,
} from "../../../redux/api/orderApi";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";

const TransactionManagement = () => {
  const deafaultData: Order = {
    shippingInfo: {
      address: "",
      city: "",
      country: "",
      state: "",
      pinCode: "",
    },

    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems: [],
    user: { name: "", _id: "" },
    _id: "",
  };
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isError, isLoading } = useOrderDetailsQuery(id!);

  const {
    shippingInfo: { address, city, country, state, pinCode },
    orderItems,
    user: { name },
    subtotal,
    tax,
    shippingCharges,
    status,
    discount,
    total,
  } = data?.order || deafaultData;

  const [updateOrder] = useProcessOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateHandler = async () => {
    const res = await updateOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });

    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async () => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });

    responseToast(res, navigate, "/admin/transaction");
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton
            flex="flex flex-row gap-4"
            className="skeleton w-[25.75rem] h-[37rem] rounded-lg"
            length={2}
          />
        ) : (
          <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${`${server}/${i.photo}`}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <span className="flex text-[15px] font-semibold flex-row gap-2 px-2 mt-1">
                Name: <p className="font-normal">{name}</p>
              </span>
              <span className="flex text-[15px] font-semibold flex-row gap-2 px-2 mt-1">
                Address:
                <p className="font-normal">{`${address}, ${city}, ${state}, ${country} ${pinCode}`}</p>
              </span>

              <h5>Amount Info</h5>
              <div className="flex flex-col text-[15px] px-2  gap-1 mt-1">
                <span className="flex font-semibold">
                  Subtotal:&nbsp; <p className="font-normal"> ₹{subtotal}</p>
                </span>

                <span className="flex font-semibold">
                  Shipping Charges:&nbsp;{" "}
                  <p className="font-normal"> ₹{shippingCharges}</p>
                </span>

                <span className="flex font-semibold">
                  Tax:&nbsp; <p className="font-normal"> ₹{tax}</p>
                </span>

                <span className="flex font-semibold">
                  Discount:&nbsp; <p className="font-normal"> ₹{discount}</p>
                </span>
                <span className="flex font-semibold">
                  Total:&nbsp; <p className="font-normal"> ₹{total}</p>
                </span>
              </div>

              <h5>Status Info</h5>
              <p className="text-[15px] font-semibold">
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;

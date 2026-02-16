import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { NewOrderRequest } from "../types/apiTypes";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { user } = useSelector(
  //   (state: { userReducer: UserReducerInitialState }) => state.userReducer
  // );👇

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  // console.log(shippingInfo);
  // console.log(user?._id);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo: shippingInfo,
      orderItems: cartItems,
      subtotal: subtotal,
      tax: tax,
      shippingCharges: shippingCharges,
      discount: discount,
      total: total,
      user: user?._id!,
      status: "Processing",
    };

    console.log(user);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      try {
        const res = await newOrder(orderData);
        if ("error" in res) {
          // Handle error from newOrder mutation
          console.error("Order creation failed:", res.error);
          toast.error((res as any).data?.message || "Failed to create order.");
        } else {
          toast.success("Order Placed Successfully!");
          dispatch(resetCart());
          navigate("/orders");
        }
      } catch (err) {
        console.error("Error during order creation:", err);
        toast.error("An unexpected error occurred.");
      }
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="max-w-[400px] w-full m-auto mt-[50px]">
        <form
          className="flex flex-col justify-start, items-stretch gap-[2rem]"
          onSubmit={submitHandler}
        >
          <PaymentElement />
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full shadow-lg p-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 duration-300 cursor-pointer"
          >
            {isProcessing ? "Processing" : "Pay"}
          </button>
        </form>
      </div>
    </>
  );
};
const Checkout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) {
    return <Navigate to={"/shipping"} />;
  }

  return (
    <>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </>
  );
};

export default Checkout;

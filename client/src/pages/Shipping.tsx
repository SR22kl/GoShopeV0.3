import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CartReducerInitailState } from "../types/reducerTypes";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { motion } from "framer-motion";

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitailState }) => state.cartReducer
  );

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cartItems.length <= 0) navigate("/cart");
  }, [cartItems]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const submitHadler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
          cartItems,
          shippingInfo,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      navigate("/pay", { state: data.clientSecret });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
      
      {/* Glow blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-400 rounded-full blur-3xl opacity-30" />

      {/* Back button */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed top-6 left-6 h-11 w-11 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-lg text-gray-800 hover:scale-105 transition"
      >
        <BiArrowBack className="mx-auto duration-300 hover:-translate-x-1" />
      </button>

      {/* Form */}
      <motion.form
        onSubmit={submitHadler}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col gap-4 max-w-md w-full p-8 
        backdrop-blur-xl bg-white/30 border border-white/40 
        shadow-xl rounded-2xl"
      >
        <h2 className="text-center text-2xl font-semibold tracking-wide text-gray-800">
          Shipping Address
        </h2>

        {/* Address */}
        <input
          className="h-12 px-4 rounded-md border border-white/40 bg-white/40 backdrop-blur-md outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="text"
          required
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />

        {/* City */}
        <input
          className="h-12 px-4 rounded-md border border-white/40 bg-white/40 backdrop-blur-md outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="text"
          required
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        {/* State */}
        <input
          className="h-12 px-4 rounded-md border border-white/40 bg-white/40 backdrop-blur-md outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="text"
          required
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />

        {/* Country */}
        <select
          className="h-12 px-4 rounded-md border border-white/40 bg-white/40 backdrop-blur-md outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
          name="country"
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
        </select>

        {/* Pin */}
        <input
          className="h-12 px-4 rounded-md border border-white/40 bg-white/40 backdrop-blur-md outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="number"
          required
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="h-12 rounded-md bg-indigo-600 text-white font-semibold 
          hover:bg-indigo-700 transition shadow-md"
          type="submit"
        >
          Pay Now
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Shipping;
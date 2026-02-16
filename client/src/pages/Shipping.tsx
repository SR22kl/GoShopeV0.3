import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CartReducerInitailState } from "../types/reducerTypes";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

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
    if (cartItems.length <= 0) {
      navigate("/cart");
    }
  }, [cartItems]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  console.log(shippingInfo);
 

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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex" id="shipping">
        <button
          onClick={() => navigate("/cart")}
          className="fixed top-[3.5rem] left-[2rem] h-[2.5rem] w-[2.5rem]  mt-[10px] p-[10px] rounded-[50%] bg-[#0b9388] text-white  shadow-lg cursor-pointer"
        >
          <BiArrowBack className="duration-300 hover:-translate-x-1.5 " />
        </button>

        <form
          onSubmit={submitHadler}
          className=" flex flex-col justify-center items-stretch gap-[1rem] max-w-[450px] w-full mx-auto mt-[80px] p-[2rem] border-1 border-gray-200 shadow-md rounded-lg"
          action=""
        >
          <h2 className="uppercase m-[0.5rem] tracking-[2px] text-center text-2xl mb-[20px]">
            Shipping Address
          </h2>
          <input
            className="p-[10px] border-1 border-gray-200 shadow-md rounded outline-none"
            type="text"
            required
            placeholder="Address"
            name="address"
            value={shippingInfo.address}
            onChange={changeHandler}
            // onChange={(e) =>
            //   setShippingInfo({ ...shippingInfo, address: e.target.value })
            // }
          />
          <input
            className="p-[10px] border-1 border-gray-200 shadow-md rounded outline-none"
            type="text"
            required
            placeholder="City"
            name="city"
            value={shippingInfo.city}
            onChange={changeHandler}
          />
          <input
            className="p-[10px] border-1 border-gray-200 shadow-md rounded outline-none"
            type="text"
            required
            placeholder="State"
            name="state"
            value={shippingInfo.state}
            onChange={changeHandler}
          />
          <select
            className="p-[10px] border-1 border-gray-200 shadow-md rounded outline-none"
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

          <input
            className="p-[10px] border-1 border-gray-200 shadow-md rounded outline-none"
            type="number"
            required
            placeholder="Pin Code"
            name="pinCode"
            value={shippingInfo.pinCode}
            onChange={changeHandler}
          />

          <button
            className="border p-[10px] mb-[20px] text-center border-teal-500 shadow-md rounded-md bg-[#2fb4a8] opacity-90 text-white cursor-pointer duration-300 hover:opacity-100 uppercase"
            type="submit"
          >
            Pay Now
          </button>
        </form>
      </div>
    </>
  );
};

export default Shipping;

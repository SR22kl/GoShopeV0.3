import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import axios from "axios";
import { RootState, server } from "../../../redux/store";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Coupon = () => {
  const [size, setSize] = useState<number>(8);
  const [amount, setAmount] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<string>("");

  const { user } = useSelector((state: RootState) => state.userReducer);

  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newCoupon = await axios
        .post(`${server}/api/v1/payment/coupon/new?id=${user?._id}`, {
          code,
          amount,
        })
        .then((res) => res.data.coupon.code);

      toast.success("Coupon created successfully");
      setCoupon(newCoupon);
    } catch (error) {
      console.error("Coupon creation failed:", error);
      toast.error("Coupon creation failed. Please check the console.");
    }
  };

  useEffect(() => {
    setIsCopied(false);
  }, [coupon]);

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl md:text-2xl font-semibold">
            Create Coupon
          </h1>
          <p className="text-sm text-gray-500">
            Generate discount coupons for customers
          </p>
        </motion.div>

        <section className="max-w-xl">
          <motion.form
            onSubmit={submitHandler}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col gap-5"
          >
            {/* Coupon Code */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                className="border border-gray-300 outline-none h-[50px] px-4 rounded-md focus:ring-2 focus:ring-indigo-400 transition"
                type="text"
                placeholder="Enter coupon code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={size}
              />
            </div>

            {/* Length */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Code Length
              </label>
              <input
                className="border border-gray-300 outline-none h-[50px] px-4 rounded-md focus:ring-2 focus:ring-indigo-400 transition"
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min={8}
                max={25}
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Discount Amount
              </label>
              <input
                className="border border-gray-300 outline-none h-[50px] px-4 rounded-md focus:ring-2 focus:ring-indigo-400 transition"
                type="number"
                placeholder="Enter discount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={100}
                max={1000}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="h-[50px] bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition active:scale-[0.98]"
            >
              Generate Coupon
            </button>
          </motion.form>

          {/* Result */}
          {coupon && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white border border-gray-200 shadow-md rounded-xl p-4 flex items-center justify-between"
            >
              <code className="font-semibold text-indigo-600 text-lg">
                {coupon}
              </code>

              <button
                onClick={() => copyText(coupon)}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition"
              >
                {isCopied ? "Copied" : "Copy"}
              </button>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Coupon;
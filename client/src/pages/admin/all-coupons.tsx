import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../../components/Loader";
import { motion } from "framer-motion";

interface Coupon {
  _id: string;
  code: string;
  amount: number;
  __v: number;
}

interface CouponResponse {
  success: boolean;
  message: string;
  count: number;
  coupons: Coupon[];
}

// animations
const tableAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const AllCoupons = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get<CouponResponse>(
        `${server}/api/v1/payment/coupon/all?id=${user?._id!}`
      );
      setCoupons(response.data.coupons);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch coupons data");
      setLoading(false);
    }
  };

  const deleteCouponHandler = async (couponId: string) => {
    try {
      const { data } = await axios.delete<{
        success: boolean;
        message: string;
      }>(`${server}/api/v1/payment/coupon/${couponId}?id=${user?._id!}`);
      toast.success(data.message);
      getAllCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  const trimCouponId = (id: string, maxLength: number = 8): string => {
    if (id.length <= maxLength) return id;
    return `${id.substring(0, maxLength)}...`;
  };

  useEffect(() => {
    if (user?._id) getAllCoupons();
  }, [user?._id]);

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-xl md:text-2xl font-semibold">All Coupons</h1>
          <span className="text-sm text-gray-500">
            {coupons.length} Coupons
          </span>
        </motion.div>

        <div className="overflow-x-auto">
          {loading ? (
            <Skeleton
              length={10}
              flex="flex flex-col gap-2"
              className="skeleton w-full h-[3rem]"
            />
          ) : coupons.length === 0 ? (
            <p className="text-gray-600">No coupons available.</p>
          ) : (
            <motion.div
              variants={tableAnim}
              initial="hidden"
              animate="show"
              className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-200">
                  <tr className="text-[12px] md:text-[15px]">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Coupon
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.map((coupon, index) => (
                    <motion.tr
                      key={coupon._id}
                      variants={rowAnim}
                      className={`hover:bg-slate-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-800">
                        {trimCouponId(coupon._id)}
                      </td>

                      <td className="px-4 py-3 font-medium text-gray-900">
                        {coupon.code}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        ₹{coupon.amount}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteCouponHandler(coupon._id)}
                          className="px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition flex items-center gap-1 ml-auto"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Add Button */}
      <Link
        to="/admin/app/coupon"
        className="fixed bottom-5 right-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition hover:scale-110"
      >
        <FaPlus />
      </Link>
    </div>
  );
};

export default AllCoupons;
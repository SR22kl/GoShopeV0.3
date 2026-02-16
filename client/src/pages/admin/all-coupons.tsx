import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../../components/Loader";

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
      const result = response.data;
      setCoupons(result.coupons);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch coupons data");
      console.error("Error fetching coupons data:", error);
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
      getAllCoupons(); // Refresh the coupon list after delteting the coupon
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
      console.error("Error deleting coupon:", error);
    }
  };

  const trimCouponId = (id: string, maxLength: number = 8): string => {
    if (id.length <= maxLength) {
      return id;
    }
    return `${id.substring(0, maxLength)}...`;
  };

  useEffect(() => {
    if (user?._id) {
      getAllCoupons();
    }
  }, [user?._id]);

  return (
    <>
      <div className="admin-container">
        <AdminSidebar />
        <main className="p-4 md:p-6">
          <h1 className="text-[18px] md:text-2xl mt-2 font-semibold mb-3 md:mb-4">
            All Coupons
          </h1>

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
              <table className="min-w-full divide-y mt-2 divide-gray-200">
                <thead className="bg-gray-200">
                  <tr className="text-[12px] md:text-[15px]">
                    <th
                      scope="col"
                      className="px-3 py-2 md:px-6 md:py-3 text-left  font-medium text-gray-900 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 md:px-6 md:py-3 text-left  font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Coupon Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 md:px-6 md:py-3 text-left  font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 md:px-6 md:py-3 text-right  font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 ">
                  {coupons.map((coupon) => (
                    <tr className="text-[12px] md:text-[15px]" key={coupon._id}>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap  text-gray-900 break-words">
                        {trimCouponId(coupon._id)}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap  text-gray-900 break-words">
                        {coupon.code}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap  text-gray-900">
                        {coupon.amount}
                      </td>
                      <td className="px-3 py-2  md:px-6 md:py-4 whitespace-nowrap text-right font-medium">
                        <button
                          onClick={() => deleteCouponHandler(coupon._id)}
                          className="bg-red-500 hover:bg-red-600 duration-300  text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded focus:outline-none focus:shadow-outline text-xs md:text-sm cursor-pointer "
                        >
                          <FaTrash className="inline-block mr-1 -mt-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
        <Link
          to="/admin/app/coupon"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md text-sm md:text-xl"
        >
          <FaPlus />
        </Link>
      </div>
    </>
  );
};

export default AllCoupons;

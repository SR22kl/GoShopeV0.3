import { useFileHandler } from "6pp";
import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/Loader";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import { responseToast, transformImage } from "../../../utils/features";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

const Productmanagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(id!);
  // console.log(data)

  const { name, price, stock, category, photos, description } =
    data?.product || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      photo: [],
    };

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const PhotoFiles = useFileHandler("multiple", 10, 5);

  if (isError) {
    return <Navigate to={"/404"} />;
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setbtnLoading(true);

    try {
      const formData = new FormData();
      if (nameUpdate) formData.set("name", nameUpdate);
      if (descriptionUpdate) formData.set("description", descriptionUpdate);
      if (priceUpdate) formData.set("price", priceUpdate.toString());
      if (stockUpdate !== undefined)
        formData.set("stock", stockUpdate.toString());
      if (categoryUpdate) formData.set("category", categoryUpdate);
      if (PhotoFiles.file && PhotoFiles.file.length > 0) {
        PhotoFiles.file.forEach((file) => {
          formData.append("photos", file);
        });
      }

      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: data?.product._id!,
      });

      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    } finally {
      setbtnLoading(false);
    }
  };
  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data && data.product) {
      setNameUpdate(data.product.name);
      setDescriptionUpdate(data.product.description);
      setCategoryUpdate(data.product.category);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
    }
  }, [data]);

  return (
    <div className="admin-container mb-[100px] ">
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
            <section className="mt-[20px] md:mt-0">
              <strong>ID-{data?.product._id}</strong>
              <img
                src={transformImage(photos?.[0]?.url || "", 500)}
                alt="Product"
              />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Update Details</h2>
                <div className="text-[14px]">
                  <label>Name</label>
                  <input
                    className="h-[40px]"
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div className="text-[14px]">
                  <label>Description</label>
                  <textarea
                    className="h-[50px] min-h-[40px] max-h-[80px] w-full border-[1px] border-gray-300 rounded-md p-2 outline-0"
                    required
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>

                <div className="text-[14px]">
                  <label>Category</label>
                  <input
                    className="h-[40px]"
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div className="text-[14px]">
                  <label>Price</label>
                  <input
                    className="h-[40px]"
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div className="text-[14px]">
                  <label>Stock</label>
                  <input
                    className="h-[40px]"
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div className="text-[14px]">
                  <label>Photos</label>
                  <input
                    className="h-[50px]"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={PhotoFiles.changeHandler}
                  />
                </div>

                {PhotoFiles.error && <p>{PhotoFiles.error}</p>}

                {PhotoFiles.preview && (
                  <div className="flex gap-[1rem] overflow-x-auto">
                    {PhotoFiles.preview.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="New Image"
                        className="w-[50px] h-[50px] object-cover"
                      />
                    ))}
                  </div>
                )}

                <motion.button
                  disabled={btnLoading}
                  type="submit"
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    btnLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                  whileHover={!btnLoading ? { scale: 1.02 } : {}}
                  whileTap={!btnLoading ? { scale: 0.98 } : {}}
                >
                  {btnLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <FiLoader className="text-lg" />
                      </motion.div>
                      Updating Product...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </motion.button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;

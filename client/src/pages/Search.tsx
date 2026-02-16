import { useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  useProductCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import { CustomError } from "../types/apiTypes";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiGrid } from "react-icons/fi";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const {
    data: searchedData,
    isLoading: productLoading,
    isError: productSearchError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    category,
    page,
    price: maxPrice,
    sort,
  });
  // console.log(searchedData);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) {
      return toast.error("Out of Stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  };

  const isprevPage = page > 1;
  const isnextPage = searchedData?.totalPage
    ? page < searchedData.totalPage
    : false;

  const {
    data: categoriesResponse,
    isError,
    isLoading: loadingCategories,
    error,
  } = useProductCategoriesQuery("");

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if (productSearchError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }
  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-[calc(100vh-6.5vh)] py-8 md:py-12 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FiSearch className="text-3xl text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Search Products
            </h1>
          </div>
          <p className="text-gray-600">Find your perfect items</p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-2xl rounded-2xl p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="text-xl text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-3"
                >
                  <label className="font-medium text-gray-700 text-sm">
                    Sort By
                  </label>
                  <select
                    className="p-3 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="asc">Price (Low to High)</option>
                    <option value="desc">Price (High to Low)</option>
                  </select>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-3"
                >
                  <label className="font-medium text-gray-700 text-sm">
                    Max Price: ₹{maxPrice.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={100000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-3"
                >
                  <label className="font-medium text-gray-700 text-sm">
                    Category
                  </label>
                  <select
                    className="p-3 border border-gray-200 rounded-xl outline-none cursor-pointer bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">ALL</option>
                    {!loadingCategories &&
                      categoriesResponse?.categories.map((i) => (
                        <option key={i} value={i}>
                          {i.toUpperCase()}
                        </option>
                      ))}
                  </select>
                </motion.div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-2xl rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <FiGrid className="text-xl text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              </div>
              <input
                className="w-full p-4 border border-gray-200 rounded-xl outline-none bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </motion.div>

            {productLoading ? (
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-2xl rounded-2xl p-6"
              >
                <div className="flex justify-start gap-3 items-start flex-wrap">
                  <Skeleton
                    className="skeleton w-full md:w-[calc(33.333%-1rem)] h-80 rounded-xl"
                    flex="flex flex-col gap-3"
                    length={6}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-2xl rounded-2xl p-6"
              >
                <div className="flex justify-start gap-4 items-start flex-wrap">
                  {searchedData?.products.map((i, index) => (
                    <motion.div
                      key={i._id}
                      variants={itemVariants}
                      layoutId={`product-${i._id}`}
                      className="w-full md:w-[calc(33.333%-1rem)]"
                    >
                      <ProductCard
                        productId={i._id}
                        name={i.name}
                        category={i.category}
                        price={i.price}
                        stock={i.stock}
                        photos={i.photos}
                        handler={addToCartHandler}
                      />
                    </motion.div>
                  ))}
                  {searchedData?.products.length === 0 && !productLoading && (
                    <motion.div
                      variants={itemVariants}
                      className="w-full text-center py-12"
                    >
                      <p className="text-gray-500 text-lg">
                        No products found matching your search criteria.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {searchedData && searchedData.totalPage > 1 && (
              <motion.article
                variants={itemVariants}
                className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-2xl rounded-2xl p-6 flex items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border border-gray-200 rounded-xl outline-none cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 font-medium"
                  disabled={!isprevPage}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  {"< Prev"}
                </motion.button>
                <span className="text-gray-700 font-medium">
                  {page} of {searchedData.totalPage}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border border-gray-200 rounded-xl outline-none cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 font-medium"
                  disabled={!isnextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  {"Next >"}
                </motion.button>
              </motion.article>
            )}
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default Search;

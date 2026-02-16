import toast from "react-hot-toast";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useProductDetailsQuery } from "../redux/api/productApi";
import { RootState } from "../redux/store";
import { CustomError } from "../types/apiTypes";
import { CartItem } from "../types/types";
import { Skeleton } from "../components/Loader";
import { addToCart, removeCartItem } from "../redux/reducer/cartReducer";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import ImageViewer from "../components/ImageViewer";
import RatingDisplay from "../components/RatingDisplay";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useProductDetailsQuery(id!);

  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const existingCartItem = cartItems.find((item) => item.productId === id);
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    } else {
      setQuantity(0);
    }
  }, [cartItems, id]);

  const addToCartHandler = (product: any) => {
    if (product.stock < 1) {
      return toast.error("Out of Stock");
    }
    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      photo: product.photos?.[0]?.url || "",
      price: product.price,
      quantity: 1,
      stock: product.stock,
    };
    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  };

  const incrementHandler = (product: any) => {
    if (quantity >= product.stock) {
      toast.error("Quantity limit exceeded");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        photo: product.photos?.[0]?.url || "",
        price: product.price,
        quantity: quantity + 1,
        stock: product.stock,
      }),
    );
    setQuantity((prev) => prev + 1);
    toast.success("Quantity increased!");
  };

  const decrementHandler = (product: any) => {
    if (quantity <= 1) {
      toast.error("Product quantity can't be less than 1");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        quantity: quantity - 1,
        name: product.name,
        photo: product.photos?.[0]?.url || "",
        price: product.price,
        stock: product.stock,
      }),
    );
    setQuantity((prev) => prev - 1);
    toast.success("Quantity decreased!");
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    setQuantity(0);
    toast.success("Item removed from cart!");
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const product = data?.product!;

  // console.log(product);

  return (
    <>
      {isLoading ? (
        <Skeleton
          className="skeleton w-full h-[35rem] rounded-lg"
          flex="flex flex-row gap-3 p-12 justify-center items-center"
          length={1}
        />
      ) : (
        // Product Details Layout
        <div className="w-full h-full">
          <div className="flex container mx-auto px-4 py-8 justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full md:w-[90%] lg:w-[80%] flex flex-col md:flex-row gap-8 p-6">
              {/* Left Column - Image Viewer */}
              <div className="md:w-1/2">
                {product?.photos && product.photos.length > 0 && (
                  <ImageViewer
                    photos={product.photos}
                    productName={product.name}
                  />
                )}
              </div>

              {/* Right Column - Product Details */}
              <div className="md:w-1/2 flex flex-col justify-between">
                {/* Product Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-gray-900">
                    {product.name}
                  </h1>

                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm text-gray-600">
                      Product ID: {product._id}
                    </span>
                  </div>

                  {/* Rating Display */}
                  <div className="mb-4">
                    <RatingDisplay productId={product._id} />
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Product Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Price and Stock */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl font-bold text-purple-600">
                        ₹{product.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <span className="text-sm text-gray-600">
                      <strong>Category:</strong>{" "}
                      {product.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {quantity === 0 ? (
                      <button
                        onClick={() => addToCartHandler(product)}
                        disabled={product.stock < 1}
                        className="flex-1 bg-gradient-to-b from-purple-600 to-violet-700 hover:opacity-90 duration-300 ease-in disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                      >
                        {product.stock < 1 ? "OUT OF STOCK" : "ADD TO CART"}
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-between border border-gray-300 rounded-lg p-3">
                        <button
                          className="duration-300 hover:text-red-500 p-2"
                          onClick={() => decrementHandler(product)}
                        >
                          <FaMinus className="text-lg" />
                        </button>
                        <span className="font-semibold text-lg">
                          {quantity}
                        </span>
                        <button
                          className="duration-300 hover:text-green-500 p-2"
                          onClick={() => incrementHandler(product)}
                          disabled={quantity >= product.stock}
                        >
                          <FaPlus className="text-lg" />
                        </button>
                      </div>
                    )}
                    {quantity > 0 && (
                      <button
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-lg transition-colors"
                        onClick={() => removeHandler(product._id)}
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    )}
                  </div>

                  {/* Share Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Share this product:
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                        title="Share on Facebook"
                      >
                        <FaFacebook className="text-lg" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                        title="Share on LinkedIn"
                      >
                        <FaLinkedin className="text-lg" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors"
                        title="Share on Instagram"
                      >
                        <FaInstagram className="text-lg" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                        title="Share on WhatsApp"
                      >
                        <FaWhatsapp className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="container mx-auto px-4 py-6">
            <div className="w-full h-full mx-auto">
              {/* Reviews Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Customer Reviews & Ratings
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  See what other customers are saying about this product
                </p>
              </div>

              {/* Reviews Content */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Review Form Section */}
                {user && user._id && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Share Your Experience
                      </h3>
                    </div>
                    <ReviewForm productId={product._id} userId={user._id} />
                  </div>
                )}

                {!user && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-100 text-center">
                    <p className="text-gray-600">
                      <a
                        href="/login"
                        className="text-purple-600 hover:text-purple-700 font-semibold"
                      >
                        Login
                      </a>{" "}
                      to write a review
                    </p>
                  </div>
                )}

                {/* Reviews List Section */}
                <div className="px-8 py-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Customer Reviews
                    </h3>
                  </div>
                  <ReviewsList productId={product._id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;

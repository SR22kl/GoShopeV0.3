import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitailState } from "../types/reducerTypes";
import toast from "react-hot-toast";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";
import { motion } from "framer-motion";
import { FiShoppingCart, FiCheck, FiTag } from "react-icons/fi";

const Cart = () => {
  const { cartItems, shippingCharges, subtotal, tax, total, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitailState }) => state.cartReducer,
    );

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isvalid, setisValid] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      toast.error("Quantity limit exceeded");
      return;
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    toast.success("Quantity increased!");
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) {
      toast.error("Product quantity can't be 0");
      return;
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    toast.success("Quantity decreased!");
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    toast.success("Item removed from cart!");
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeOut = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?code=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          if (res) {
            dispatch(discountApplied(res.data.discount));
            setisValid(true);
            dispatch(calculatePrice());
          }
        })
        .catch((e) => {
          console.log(e.response?.data);
          dispatch(discountApplied(0));
          setisValid(false);
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(timeOut);
      cancel();
      setisValid(false);
    };
  }, [couponCode, dispatch]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

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

  return (
    <>
      <div className="bg-gradient-to-b from-indigo-50 to-indigo-200 min-h-[calc(100vh-4rem)] py-8 md:py-12 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FiShoppingCart className="text-3xl text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    layoutId={`cart-item-${index}`}
                  >
                    <CartItemCard
                      incrementHandler={incrementHandler}
                      decrementHandler={decrementHandler}
                      removeHandler={removeHandler}
                      cartItem={item}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <FiShoppingCart className="text-4xl text-purple-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-6">
                  Add some products to your cart and they will show up here.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Order Summary Section */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 border-b border-gray-200 pb-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{subtotal}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600 font-medium">Shipping</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{shippingCharges}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600 font-medium">Tax</span>
                    <span className="text-lg font-semibold text-red-600">
                      ₹{tax}
                    </span>
                  </motion.div>

                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600 font-medium">
                        Discount
                      </span>
                      <span className="text-lg font-semibold text-green-600">
                        -₹{discount}
                      </span>
                    </motion.div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 pt-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{total}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Coupon Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiTag className="text-xl text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Promo Code
                  </h3>
                </div>

                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:shadow-md transition-all font-semibold uppercase text-center"
                  placeholder="Enter coupon code"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: couponCode ? 1 : 0,
                    height: couponCode ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 overflow-hidden"
                >
                  {couponCode && (
                    <>
                      {isvalid ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <FiCheck className="text-green-600 text-lg" />
                          <div>
                            <p className="text-sm font-semibold text-green-900">
                              ₹{discount} off applied
                            </p>
                            <p className="text-xs text-green-700">
                              Code: <code>"{couponCode}"</code>
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <VscError className="text-red-600 text-lg" />
                          <p className="text-sm font-semibold text-red-900">
                            Invalid coupon code
                          </p>
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              </motion.div>

              {/* Checkout Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {cartItems.length > 0 ? (
                  <Link to="/shipping" className="block">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 font-bold py-4 px-6 rounded-lg cursor-not-allowed"
                  >
                    Checkout Disabled
                  </motion.button>
                )}
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 text-center"
              >
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  ✓ Secure Checkout
                </p>
                <p className="text-xs text-gray-600">
                  Your payment information is safe and secure
                </p>
              </motion.div>
            </div>
          </motion.aside>
        </div>
      </div>
    </>
  );
};

export default Cart;

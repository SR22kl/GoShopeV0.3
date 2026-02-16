import { useState } from "react";
import { FaSearch, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { User } from "../types/types";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import cart from "../assets/GS.png";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { motion, AnimatePresence } from "framer-motion";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to logout!");
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/50 shadow-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-[70px]">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            whileHover={{ rotate: 12, scale: 1.1 }}
            src={cart}
            alt="logo"
            className="w-[42px]"
          />
          <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            GoShopy
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6 text-gray-700 font-medium">
          <Link
            onClick={() => setIsOpen(false)}
            to="/"
            className="hover:text-blue-600 transition duration-300"
          >
            Home
          </Link>

          {/* SEARCH */}
          <Link
            to="/search"
            className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
          >
            <FaSearch size={18} />
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
          >
            <FaCartShopping size={18} />

            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* USER */}
          {user && user._id ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
              >
                <FaUser size={18} />
              </button>

              {/* DROPDOWN */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-40 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="flex flex-col text-sm">
                      {user.role === "admin" && (
                        <Link
                          onClick={() => setIsOpen(false)}
                          to="/admin/dashboard"
                          className="px-4 py-2 hover:bg-blue-50"
                        >
                          Admin
                        </Link>
                      )}

                      <Link
                        onClick={() => setIsOpen(false)}
                        to="/orders"
                        className="px-4 py-2 hover:bg-blue-50"
                      >
                        Orders
                      </Link>

                      <button
                        onClick={logoutHandler}
                        className="px-4 py-2 text-left hover:bg-red-50 text-red-500 flex items-center gap-2"
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
            >
              <FaSignInAlt size={18} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

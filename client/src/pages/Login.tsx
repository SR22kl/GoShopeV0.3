import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/apiTypes";
import { motion } from "framer-motion";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const logInHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid,
      });

      if ("data" in res) {
        toast.success(res.data?.message!);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
      }
    } catch {
      toast.error("SignIn Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Floating animated card */}
      <motion.main
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-8"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-gray-700 mb-8 tracking-wide"
        >
          Welcome Back 👋
        </motion.h1>

        {/* Gender */}
        <div className="mb-5">
          <label className="text-gray-600 text-sm font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-2 w-full p-3 rounded-lg bg-white/80 focus:bg-white outline-none border border-transparent focus:border-indigo-500 transition"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* DOB */}
        <div className="mb-8">
          <label className="text-gray-600 text-sm font-medium">
            Date of Birth
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full p-3 rounded-lg bg-white/80 focus:bg-white outline-none border border-transparent focus:border-indigo-500 transition"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-[1px] bg-gray-200/80"></div>
          <span className="text-gray-600 text-sm">Continue with</span>
          <div className="flex-1 h-[1px] bg-gray-200/80"></div>
        </div>

        {/* Google Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logInHandler}
          className="flex items-center justify-center gap-3 w-full p-3 bg-white rounded-xl shadow-lg font-semibold text-gray-700 hover:shadow-xl transition"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </motion.button>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Secure login powered by Google
        </p>
      </motion.main>
    </div>
  );
};

export default Login;

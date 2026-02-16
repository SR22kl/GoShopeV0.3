import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/apiTypes";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const logInHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      // console.log(user);

      // console.log({
      //   name: user.displayName!,
      //   email: user.email!,
      //   photo: user.photoURL!,
      //   gender,
      //   role: "user",
      //   dob: date,
      //   _id: user.uid,
      // });

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
    } catch (error) {
      console.log("SignIn Failed");
      toast.error("SignIn Failed");
    }
  };
  // console.log(gender);
  return (
    <>
      <div className="flex flex-col h-[90vh] " id="login">
        <main className="flex flex-col justify-center items-stretch gap-[1rem] max-w-[400px] w-full h-[80%] mx-auto mt-[60px] p-[3rem] border-1 border-gray-200 shadow-md rounded-lg">
          <h1 className="uppercase text-2xl font-semibold mb-[40px] text-center ">
            Login
          </h1>
          <div className="flex flex-col gap-[0.1rem] w-full">
            <label className="text-md">Gender</label>
            <select
              className="p-[10px] border-1 border-gray-200 shadow-md rounded outline-none cursor-pointer font-serif"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-[0.1rem] w-full">
            <label>Date of Birth</label>
            <input
              className="p-[10px] border-1 border-gray-200 shadow-md rounded outline-none cursor-pointer"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-start items-stretch gap-[0.5rem] mt-[50px] w-full ">
            <p className="text-center">Already Signed In?</p>
            <button
              className="flex w-[70%] m-auto h-[3rem] gap-1 items-center text-[1rem] border-1 border-[rgb(62,125,242)] bg-[rgb(62,125,242)] text-white shadow-md rounded outline-none cursor-pointer duration-300 hover:scale-[1.05] ease-in-out"
              onClick={logInHandler}
            >
              <FcGoogle className="bg-white h-full w-[30%] rounded" />{" "}
              <span className="w-full">Sign in with Google</span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;

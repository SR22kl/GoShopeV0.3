import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import axios from "axios";
import { RootState, server } from "../../../redux/store";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// const allNumbers = "1234567890";
// const allSymbols = "!@#$%^&*()_+";

const Coupon = () => {
  const [size, setSize] = useState<number>(8);
  const [amount, setAmount] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  // const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  // const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);

  const [coupon, setCoupon] = useState<string>("");

  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true);
  };

  const { user } = useSelector((state: RootState) => state.userReducer);

  // const submitHandler = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!includeNumbers && !includeCharacters && !includeSymbols)
  //     return alert("Please Select One At Least");

  //   let result: string = prefix || "";
  //   const loopLength: number = size - result.length;

  //   for (let i = 0; i < loopLength; i++) {
  //     let entireString: string = "";
  //     if (includeCharacters) entireString += allLetters;
  //     if (includeNumbers) entireString += allNumbers;
  //     if (includeSymbols) entireString += allSymbols;

  //     const randomNum: number = ~~(Math.random() * entireString.length);
  //     result += entireString[randomNum];

  //   }

  //   setCoupon(result);
  // };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newCoupon = await axios
        .post(`${server}/api/v1/payment/coupon/new?id=${user?._id}`, {
          code,
          amount,
        })
        .then((res) => {
          return res.data.coupon.code;
        });
      toast.success("coupon created successfully");
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
      <main className="dashboard-app-container">
        <h1 className="text-[18px] md:text-[24px] font-semibold">Create Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <div className="flex flex-col  p-1">
              <label className="mb-1">Coupon Code</label>
              <input
                className="border outline-0 h-[55px] p-4 rounded-md"
                type="text"
                placeholder="Text to include"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={size}
              />
            </div>

            <div className="flex flex-col  p-0.5">
              <label className="mb-1">Code Length</label>
              <input
                className="border outline-0 h-[55px] p-4 rounded-md"
                type="number"
                placeholder="Coupon Length"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min={8}
                max={25}
              />
            </div>

            {/* <fieldset>
              <legend>Include</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset> */}
            <div className="flex flex-col  p-1">
              <label className="mb-1">Amount</label>
              <input
                className="border outline-0 h-[55px] p-4 rounded-md"
                type="number"
                placeholder="Add Coupon Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={100}
                max={1000}
              />
            </div>
            <button type="submit">Generate</button>
          </form>

          {coupon && (
            <code>
              {coupon}{" "}
              <span onClick={() => copyText(coupon)}>
                {isCopied ? "Copied" : "Copy"}
              </span>{" "}
            </code>
          )}
        </section>
      </main>
    </div>
  );
};

export default Coupon;

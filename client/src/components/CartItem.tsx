import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";

type CartItemProps = {
  cartItem: CartItem;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;
};
const CartItemCard = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { productId, name, price, photo, quantity } = cartItem;

  console.log(photo)

  return (
    <>
      <div
        className="flex justify-start items-center p-[1rem] gap-[1.5rem] md:gap-[3rem] border-b-[1px] border-[#00000014] "
        id="cartItem"
        key={productId}
      >
        <img
          className="w-[100px] h-[100px] object-contain duration-300 hover:scale-110 ease-in-out cursor-pointer"
          src={`${photo}`}
          alt={name}
        />
        <article className="flex flex-col justify-start items-center gap-[0.25rem]">
          <Link
            className="text-[12px] md:text-[1rem] duration-300 font-[400] hover:text-blue-900"
            to={`/product/${productId}`}
          >
            <p>{name}</p>
          </Link>
          <span className="text-[12px] md:text-[1rem] pr-2 md:pr-0 font-bold">₹{price}</span>
          {/* <p>Category: {category}</p>
          <p>Stock: {stock}</p>
          <p>Quantity: {quantity}</p> */}
        </article>

        <div className="text-[12px] md:text-[18px] ml-auto flex items-center gap-[0.8rem]">
          <button className="duration-300 bg-gray-100 hover:bg-[#ff0000a4] p-1 rounded cursor-pointer">
            <FaMinus onClick={() => decrementHandler(cartItem)} />
          </button>
          <p>{quantity}</p>

          <button className="duration-300 bg-gray-100 hover:bg-[#79d21289] p-1 rounded cursor-pointer">
            <FaPlus onClick={() => incrementHandler(cartItem)} />
          </button>
        </div>

        <button className="bg-transparent flex md:text-[1.2rem] cursor-pointer duration-300 hover:text-red-500">
          <FaTrash onClick={() => removeHandler(productId)} />
        </button>
      </div>
    </>
  );
};

export default CartItemCard;

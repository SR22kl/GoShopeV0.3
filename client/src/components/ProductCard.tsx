import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";
import { useNavigate } from "react-router-dom";

type ProductCardProps = {
  productId: string;
  name: string;
  price: number;
  photos: {
    public_id: string;
    url: string;
  }[];
  category: string;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  name,
  price,
  photos,
  stock,
  handler,
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="relative bg-white w-[17.75rem] h-[25rem] p-[1rem] flex-none flex flex-col justify-start items-center gap-[5px] "
        id="productCard"
      >
        <img
          className="h-[cal(17.75-3rem)] object-cover m-[1rem]"
          src={photos?.[0]?.url}
          alt={name}
        />
        <p className="text-[16px] font-semibold truncate max-w-[150px]">
          {name}
        </p>
        <div className="flex flex-row justify-between gap-[1rem] ">
          <span className="text-[14px]">Stock : {stock}</span>
        </div>
        <span className="font-bold text-[16px]">₹{price}</span>

        <div className="flex flex-col" id="productBtn">
          <button
            id="addtoCartBtn"
            onClick={() =>
              handler({
                productId,
                name,
                price,
                photo: photos[0]?.url,
                stock,
                quantity: 1,
              })
            }
          >
            <FaPlus />
          </button>
          <button
            onClick={() => navigate(`/product/${productId}`)}
            className="bg-[#155a96] p-2 opacity-90 rounded-md text-white cursor-pointer hover:scale-110 duration-300 ease-in-out"
          >
            View Details
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

import { FaStar } from "react-icons/fa";
import { useGetProductAverageRatingQuery } from "../redux/api/reviewApi";

interface RatingDisplayProps {
  productId: string;
}

const RatingDisplay = ({ productId }: RatingDisplayProps) => {
  const { data, isLoading } = useGetProductAverageRatingQuery(productId);

  const averageRating = data?.averageRating || 0;
  const totalReviews = data?.totalReviews || 0;

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize =
      size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(rating);
          const isPartial = star === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <div key={star} className="relative">
              <FaStar className={`${starSize} text-gray-300`} />
              {isFilled && (
                <FaStar
                  className={`absolute top-0 left-0 ${starSize} text-yellow-400`}
                  style={{ clipPath: "inset(0 0 0 0)" }}
                />
              )}
              {isPartial && (
                <FaStar
                  className={`absolute top-0 left-0 ${starSize} text-yellow-400`}
                  style={{
                    clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-gray-300 rounded animate-pulse"
            ></div>
          ))}
        </div>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Stars */}
      <div className="flex items-center gap-2">
        {renderStars(averageRating)}
        <span className="text-lg font-semibold text-gray-900">
          {averageRating.toFixed(1)}
        </span>
      </div>

      {/* Review Count */}
      <span className="text-sm text-gray-600">
        ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
      </span>
    </div>
  );
};

export default RatingDisplay;

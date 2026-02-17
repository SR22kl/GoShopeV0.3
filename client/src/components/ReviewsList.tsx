import { useState } from "react";
import { FaStar, FaUser } from "react-icons/fa";
import { useGetProductReviewsQuery } from "../redux/api/reviewApi";
import { Review } from "../types/apiTypes";

interface ReviewsListProps {
  productId: string;
}

const ReviewsList = ({ productId }: ReviewsListProps) => {
  const [sortBy, setSortBy] = useState<"latest" | "top">("latest");

  const { data, isLoading, error } = useGetProductReviewsQuery({
    productId,
    sort: sortBy,
  });

  const reviews = data?.reviews || [];
  const totalReviews = data?.totalReviews || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <div className="w-24 h-4 bg-gray-300 rounded mb-1"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load reviews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <h3 className="md:text-lg text-sm font-semibold text-gray-900">
          Customer Reviews ({totalReviews})
        </h3>

        {totalReviews > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("latest")}
              className={`md:px-4 md:py-2 px-2 py-1 rounded-md md:text-sm text-xs font-medium transition-colors ${
                sortBy === "latest"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy("top")}
              className={`md:px-4 md:py-2 px-2 py-1 rounded-md md:text-sm text-xs font-medium transition-colors ${
                sortBy === "top"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Top Rated
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No reviews yet</p>
          <p className="text-sm text-gray-400">
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: Review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              {/* User Info and Rating */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center md:gap-3 gap-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.user.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-gray-400 text-sm" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium md:text-md text-xs truncate text-gray-900">
                      {review.user.name}
                    </p>
                    <p className="md:text-sm text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center md:gap-2 gap-1 ">
                  {renderStars(review.rating)}
                  <span className="md:text-sm text-xs font-medium text-gray-700">
                    {review.rating}/5
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 leading-relaxed md:text-sm text-xs">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;

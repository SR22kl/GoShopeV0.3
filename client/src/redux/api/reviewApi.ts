import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AverageRatingResponse,
  CreateReviewRequest,
  MessageResponse,
  ReviewsResponse,
} from "../../types/apiTypes";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/review/`,
  }),
  tagTypes: ["reviews"],
  endpoints: (builder) => ({
    // Get reviews for a product
    getProductReviews: builder.query<
      ReviewsResponse,
      { productId: string; sort?: "latest" | "top" }
    >({
      query: ({ productId, sort = "latest" }) => `${productId}?sort=${sort}`,
      providesTags: ["reviews"],
    }),

    // Get average rating for a product
    getProductAverageRating: builder.query<AverageRatingResponse, string>({
      query: (productId) => `average/${productId}`,
      providesTags: ["reviews"],
    }),

    // Create a new review
    createReview: builder.mutation<MessageResponse, CreateReviewRequest>({
      query: ({ productId, rating, comment, userId }) => ({
        url: `new?id=${userId}`,
        method: "POST",
        body: { productId, rating, comment },
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetProductAverageRatingQuery,
  useCreateReviewMutation,
} = reviewApi;

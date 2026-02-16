import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllOrdersResponse,
  DeleteOrderRequest,
  MessageResponse,
  NewOrderRequest,
  OrderDetailResponse,
  UpdateOrderRequest,
} from "../../types/apiTypes";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    
    processOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, DeleteOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),

    myOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => ({
        url: `my?id=${id}`,
        method: "GET",
        providesTags: ["orders"],
      }),
    }),

    allOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => ({
        url: `all?id=${id}`,
        method: "GET",
        providesTags: ["orders"],
      }),
    }),

    orderDetails: builder.query<OrderDetailResponse, string>({
      query: (id) => ({
        url: `${id}`,
        method: "GET",
        providesTags: ["orders"],
      }),
    }),
  }),
});

export const {
  useNewOrderMutation,
  useProcessOrderMutation,
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useAllOrdersQuery,
  useMyOrdersQuery,
} = orderApi;

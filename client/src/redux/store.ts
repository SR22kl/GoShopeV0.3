import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/productApi";
import { userApi } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderApi";
import { dashboardApi } from "./api/dashboardApi";
import { reviewApi } from "./api/reviewApi";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
  },
  middleware: (mid) =>
    mid().concat(
      userApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      dashboardApi.middleware,
      reviewApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

import {
  BarChart,
  CartItem,
  LineChart,
  Order,
  OrderDetails,
  PieChart,
  Product,
  ShippingInfo,
  Stats,
  User,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllUserResponse = {
  success: boolean;
  users: User[];
};

export type UserDetailsResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type SeachProductsResponse = {
  success: boolean;
  products: Product[];
  totalPage: number;
  currentPage: number;
  totalItems: number;
};

export type ProductDetailsResponse = {
  success: boolean;
  product: Product;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type OrderDetailResponse = {
  success: boolean;
  order: OrderDetails;
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: PieChart;
};

export type BarResponse = {
  success: boolean;
  charts: BarChart;
};
export type LineResponse = {
  success: boolean;
  charts: LineChart;
};

export type SeachProductsRequest = {
  price: number;
  page: number;
  search: string;
  sort: string;
  category: string;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};

export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
  status: string;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};
export type DeleteOrderRequest = {
  userId: string;
  orderId: string;
};

// Review Types
export type Review = {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReviewsResponse = {
  success: boolean;
  reviews: Review[];
  totalReviews: number;
};

export type AverageRatingResponse = {
  success: boolean;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: number[];
};

export type CreateReviewRequest = {
  productId: string;
  rating: number;
  comment: string;
  userId: string;
};

import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
  // role: string;
  // password: string;
}
export interface NewProductRequestBody {
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

export type invalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export type shippingType = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export type orderItemsType = {
  name: string;
  price: number;
  photo: string;
  quantity: number;
  productId: string;
};

export interface NewOrderRequestBody {
  shippingInfo: shippingType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  orderItems: [orderItemsType];
}

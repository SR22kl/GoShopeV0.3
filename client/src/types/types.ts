export type User = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: string;
  role: string;
};

export type Product = {
  _id: string;
  name: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  category: string;
  price: number;
  stock: number;
  description: string;
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type CartItem = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  stock: number;
};

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

export type OrderDetails = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ChangePercent = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};
export type Count = {
  revenue: number;
  products: number;
  users: number;
  orders: number;
};

export type LatestTransactions = {
  _id: string;
  name: string;
  discount: number;
  total: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categoriesCountData: Record<string, number>[];
  changePercent: ChangePercent;
  count: Count;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  genderRatioPercent: {
    femaleUsers: number;
    maleUsers: number;
  };
  latestTransactions: LatestTransactions[];
};

export type PieChart = {
  orderFullfillment: {
    processing: number;
    shipped: number;
    delivered: number;
  };
  productsCategories: Record<string, number>[];
  stockAvailablity: {
    inStock: number;
    OutOfStock: number;
  };
  revenueDistribution: {
    grossIncome: number;
    productionCost: number;
    discount: number;
    burnt: number;
    marketingCost: number;
    netMargin: number;
  };
  usersAgeGroup: {
    Teen: number;
    Adult: number;
    Senior: number;
  };
  adminCustomer: {
    admin: number;
    customer: number;
  };
};

export type BarChart = {
  users: number[];
  products: number[];
  orders: number[];
};

export type LineChart = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};

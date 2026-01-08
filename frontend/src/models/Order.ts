export type Customer = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
};

export type Seller = {
  _id: string;
  firstname: string;
  lastname: string;
};


export type Request = {
  _id: string;
  customerId: Customer;

  dimensions: {
    height: number;
    width: number;
    length: number;
    bedLength?: number;
    bedHeight?: number;

    doorDimensions: {
      doorPlacement: "right" | "left" | "aft";
      doorWidth: number;
      doorHeight: number;
    };

     windowOptions: {
      rightWindowHeight?: number;
      rightWindowLength?: number;
      leftWindowHeight?: number;
      leftWindowLength?: number;
      bedWindowHeight?: number;
      bedWindowLength?: number;
      rearWindowHeight?: number;
      rearWindowLength?: number;
    };
  };

  preferences: string;

  agreedPrice: number;

  status: "requested" | "assigned" | "approved" | "paid";

  sellerId: Seller;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  _id: string;
  customerId: Customer;
  sellerId?: Seller;
  requestId: Request;
  amount: number;
  status: "created" | "processed" | "shipped" | "completed" | "cancelled";
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
};

export type IOrderUpdate = {
  amount: number;
  status: "created" | "processed" | "shipped" | "completed" | "cancelled";
};

export type IOrderUpdateStatus = {
  status: "created" | "processed" | "shipped" | "completed" | "cancelled";
};
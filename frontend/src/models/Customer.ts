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
  role: "seller" | "customer";
  createdAt: string;
};

export interface ICustomerCreate {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  role: "customer";
}

export interface ICustomerUpdate {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
}

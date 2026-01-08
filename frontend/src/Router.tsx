import { createBrowserRouter, Outlet } from "react-router-dom";
import { About } from "./pages/About";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { CustomerOrder } from "./pages/customer/CustomerOrder";
import { CustomerRequest } from "./pages/customer/CustomerRequest";
import { Customize } from "./pages/Customize";
import { Gallery } from "./pages/Gallery";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { OrderProcess } from "./pages/OrderProcess";
import { Register } from "./pages/Register";
import { SellerCustomer } from "./pages/seller/SellerCustomer";
import { SellerCustomers } from "./pages/seller/SellerCustomers";
import { SellerDashboard } from "./pages/seller/SellerDashboard";
import { SellerOrder } from "./pages/seller/SellerOrder";
import { SellerOrders } from "./pages/seller/SellerOrders";
import { RoleGuard } from "./components/RoleGuard";
import { SellerRequests } from "./pages/seller/SellerRequests";
import { SellerRequest } from "./pages/seller/SellerRequest";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import PasswordReset from "./pages/PasswordReset";
import { Payment } from "./pages/customer/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "gallery", element: <Gallery /> },
      { path: "order-process", element: <OrderProcess /> },
      { path: "customize", element: <Customize /> },
      { path: "about", element: <About /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "reset-password/:token", element: <PasswordReset />},

      {
        path: "seller",
        element: (
          <RoleGuard allowedRoles={["seller"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <SellerDashboard /> },
          { path: "requests", element: <SellerRequests /> },
          { path: "requests/:id/chat", element: <SellerRequest /> },
          { path: "orders", element: <SellerOrders /> },
          { path: "orders/:id", element: <SellerOrder /> },
          { path: "customers", element: <SellerCustomers /> },
          { path: "customer/:id", element: <SellerCustomer /> },
        ],
      },
      {
        path: "customer",
        element: (
          <RoleGuard allowedRoles={["customer"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <CustomerDashboard /> },
          { path: "orders/:id", element: <CustomerOrder /> },
          { path: "requests/:id/chat", element: <CustomerRequest /> },
          { path: "payment/:requestId", element: <Payment /> },
        ],
      },
    ],
  },
]);
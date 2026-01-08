import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./Router";
import "./style.css";
import './i18n';
import { AuthProvider } from "./context/authContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);
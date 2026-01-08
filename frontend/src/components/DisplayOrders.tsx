import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Order } from "../models/Order";
import { useTranslation } from "react-i18next";

interface IDisplayOrdersProps {
  o: Order;
}

export const DisplayOrders = ({ o }: IDisplayOrdersProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const goToOrder = () => {
    if (!user) return;
    const base = user.role === "seller" ? "/seller" : "/customer";
    navigate(`${base}/orders/${o._id}`);
  };

  const statusMap: Record<string, string> = {
    created: t("created"),
    processed: t("processed"),
    shipped: t("shipped"),
    completed: t("completed"),
    cancelled: t("cancelled"),
    preparingOrder: t("preparingOrder")
  };

  return (
    <div className={`card request ${o.status}`} onClick={goToOrder}>
      <h3>
        {`${t("order")}: ${o._id}`}
      </h3>

      {user?.role === "seller" && (
        <div className="requestInfo">
          <p>
            <strong>{t("customerDetails")}:</strong> {o.customerId.firstname}{" "}
            {o.customerId.lastname}
          </p>
          <p>
            <strong>{t("placeholderEmail")}:</strong> {o.customerId.email}
          </p>
          <p>
            <strong>{t("placeholderPhone")}:</strong> {o.customerId.phone}
          </p>
          <p>
            <strong>{t("location")}:</strong> {o.customerId.city},{" "}
            {o.customerId.country}
          </p>
          <p>
            <strong>{t("status")}:</strong>{" "}
            <span className={`status ${o.status}`}>{statusMap[o.status] || o.status}</span>
          </p>
        </div>
      )}

      {user?.role === "customer" && (
        <div className="requestInfo">
          <p>
            <strong>{t("status")}:</strong>{" "}
            <span className={`status ${o.status}`}>{statusMap[o.status] || o.status}</span>
          </p>
          <p>
            <strong>{t("submitted")}:</strong>{" "}
            {new Date(o.createdAt).toLocaleDateString("sv-SE")}
          </p>
          <p>
            <strong>{t("lastUpdated")}:</strong>{" "}
            {new Date(o.updatedAt).toLocaleDateString("sv-SE")}
          </p>
        </div>
      )}
    </div>
  );
};
import { useNavigate } from "react-router";
import { Request } from "../models/Request";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { FaCreditCard } from "react-icons/fa";
import { api } from "../services/baseService";
import { useState } from "react";

interface IDisplayRequestsProps {
  r: Request;
}

export const DisplayRequests = ({ r }: IDisplayRequestsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [paying, setPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const goToChat = () => {
    if (!user) return;
    const base = user.role === "seller" ? "/seller" : "/customer";
    navigate(`${base}/requests/${r._id}/chat`);
  };

  const goToPayment = async () => {
    try {
      setPaying(true);

      const res = await api.post("/stripe/create-embedded-session", {
        requestId: r._id,
      });

          console.log("Embedded session response:", res.data);
          
      navigate(`/customer/payment/${r._id}`, {
        state: { clientSecret: res.data.clientSecret },
      });
    } catch {
      setErrorMessage(t("paymentFailed"));
      setPaying(false);
    }
  };

  const statusMap: Record<string, string> = {
    requested: t("requested"),
    assigned: t("assigned"),
    approved: t("approved"),
    paid: t("paid"),
  };

  return (
    <>
      {errorMessage && <p className="message error centerText">{errorMessage}</p>}

      <div
        className={`card request ${r.status}`}
        onClick={goToChat}
        role="button"
        tabIndex={0}
      >
        {user?.role === "customer" && r.status === "approved" && (
          <button
            className="payNowBadge"
            onClick={(e) => {
              e.stopPropagation();
              goToPayment();
            }}
            aria-label={t("payNow")}
            disabled={paying}
          >
            <FaCreditCard />
            <span>{t("payNow")}</span>
          </button>
        )}

        <h3>{t("request")}: {r._id}</h3>

        {user?.role === "seller" && (
          <div className="requestInfo">
            <p>
              <strong>{t("customerDetails")}:</strong> {r.customerId.firstname}{" "}
              {r.customerId.lastname}
            </p>
            <p>
              <strong>{t("placeholderEmail")}:</strong> {r.customerId.email}
            </p>
            <p>
              <strong>{t("placeholderPhone")}:</strong> {r.customerId.phone}
            </p>
            <p>
              <strong>{t("location")}:</strong> {r.customerId.city},{" "}
              {r.customerId.country}
            </p>
          </div>
        )}

        {user?.role === "customer" && (
          <div className="requestInfo">
            <p>
              <strong>{t("status")}:</strong> {statusMap[r.status] || r.status}
            </p>
            <p>
              <strong>{t("submitted")}:</strong>{" "}
              {new Date(r.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>{t("lastUpdated")}:</strong>{" "}
              {new Date(r.updatedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

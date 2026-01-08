import { useEffect, useState } from "react";
import { API_URL } from "../services/baseService";
import { useCustomers } from "../hooks/useCustomers";
import { useTranslation } from "react-i18next";

interface SessionData {
  email: string;
  amount?: number;
  requestId?: string;
  status?: string;
}

export const OrderConfirmation = () => {
  const { t } = useTranslation();
  const { customer, fetchCustomerByEmailHandler } = useCustomers();
  const [sessionData, setSessionData] = useState<SessionData>({ email: "" });

  useEffect(() => {
    const fetchSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
      if (!sessionId) return;

      try {
        const response = await fetch(`${API_URL}/stripe/sessions/${sessionId}`);
        const data = await response.json();
        setSessionData(data);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (sessionData?.email) {
      fetchCustomerByEmailHandler(sessionData.email);
    }
  }, [sessionData]);

  if (!sessionData || !customer) return <p>{t("loading")}</p>;

  return (
    <>
      <div className="form">
        <h1>{t("orderConfirmation")}</h1>
        <h2>{sessionData.requestId}</h2>
    
        <section className="card">
        <h3>
          {t("thankYou")}, {customer.firstname} {customer.lastname}!
        </h3>
        <div className="orderAmount">
        <p className="centerText">
        {t("amountPaid")}:<strong>{sessionData.amount?.toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}</strong> Sek
        </p>
        <p className="centerText">{t("confirmationEmail")}</p>
        </div>
        </section>
      </div>
    </>
  );
};

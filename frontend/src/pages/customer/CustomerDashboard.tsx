import { useRequest } from "../../hooks/useRequests";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { DisplayRequests } from "../../components/DisplayRequests";
import { CreateRequest } from "../../components/CreateRequest";
import { useOrders } from "../../hooks/useOrders";
import { DisplayOrders } from "../../components/DisplayOrders";
import { useTranslation } from "react-i18next";

export const CustomerDashboard = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const { customerRequests, fetchRequestsByCustomerHandler } = useRequest();
  const { customerOrders, fetchOrdersByCustomerHandler } = useOrders();

  useEffect(() => {
    if (user?._id) {
      fetchRequestsByCustomerHandler(user._id);
      fetchOrdersByCustomerHandler(user._id);
    }
  }, [user?._id]);

  if (isLoading) {
    return <p>{t("loading")}</p>;
  }
   if (!user) {
    return <p>{t("loading")}</p>;
  }

  return (
    <>
      <h1>{t("dashboard")}</h1>
      <section>
  {customerOrders.length > 0 && (
    <>
      <h2>{t("orders")}</h2>
      {customerOrders.map((o) => (
        <DisplayOrders key={o._id} o={o} />
      ))}
    </>
  )}

  {customerRequests.length > 0 ? (
    <>
      <h2>{t("requests")}</h2>
      {customerRequests.map((r) => (
        <DisplayRequests key={r._id} r={r} />
      ))}
    </>
  ) : (
    <>
      <p className="intro centerText">{t("noRequestsYet")}</p>
      <CreateRequest customerId={user._id} />
    </>
  )}
</section>
    </>
  );
};
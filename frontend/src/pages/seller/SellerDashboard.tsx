import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRequest } from "../../hooks/useRequests";
import { DisplayRequests } from "../../components/DisplayRequests";
import { useOrders } from "../../hooks/useOrders";
import { DisplayOrders } from "../../components/DisplayOrders";

export const SellerDashboard = () => {
  const { t } = useTranslation();

  const { requests } = useRequest();
  const { orders } = useOrders();

  const [searchTextRequests, setSearchTextRequests] = useState("");
  const [searchTextOrders, setSearchTextOrders] = useState("");


  const requestsNeedingAttention = requests.filter(
    (r) => r.status === "requested"
  );

  const filteredRequests = requestsNeedingAttention
    .filter((r) => {
      const s = searchTextRequests.toLowerCase();

      return (
        r.customerId?.firstname?.toLowerCase().includes(s) ||
        r.customerId?.lastname?.toLowerCase().includes(s) ||
        r.customerId?.email?.toLowerCase().includes(s) ||
        r.customerId?.city?.toLowerCase().includes(s) ||
        r.customerId?.country?.toLowerCase().includes(s) ||
        r._id?.toLowerCase().includes(s)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );


  const ordersNeedingAttention = orders.filter(
    (o) => o.status === "created"
  );

  const filteredOrders = ordersNeedingAttention
    .filter((o) => {
      const s = searchTextOrders.toLowerCase();

      return (
        o.customerId?.firstname?.toLowerCase().includes(s) ||
        o.customerId?.lastname?.toLowerCase().includes(s) ||
        o.customerId?.email?.toLowerCase().includes(s) ||
        o.customerId?.city?.toLowerCase().includes(s) ||
        o.customerId?.country?.toLowerCase().includes(s) ||
        o.requestId?._id?.toLowerCase().includes(s) ||
        o._id?.toLowerCase().includes(s)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );

  return (
    <>

      <h1>{t("requestsNeedAttention")}</h1>

      <section className="searchFieldSection">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="searchField"
            type="text"
            placeholder={t("requestsSearch")}
            value={searchTextRequests}
            onChange={(e) => setSearchTextRequests(e.target.value)}
          />
        </form>
      </section>

      <section>
        {requestsNeedingAttention.length === 0 ? (
          <p className="intro centeredText">{t("noRequestsNeedAttention")}</p>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((r) => (
            <DisplayRequests key={r._id} r={r} />
          ))
        ) : (
          <p className="intro centerText">{t("noMatch")}</p>
        )}
      </section>

      <h1>{t("ordersNeedAttention")}</h1>

      <section className="searchFieldSection">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="searchField"
            type="text"
            placeholder={t("searchOrders")}
            value={searchTextOrders}
            onChange={(e) => setSearchTextOrders(e.target.value)}
          />
        </form>
      </section>

      <section>
        {ordersNeedingAttention.length === 0 ? (
          <p className="intro">{t("noOrdersNeedAttention")}</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((o) => (
            <DisplayOrders key={o._id} o={o} />
          ))
        ) : (
          <p className="intro centerText">{t("noMatchOrder")}</p>
        )}
      </section>
    </>
  );
};
import { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { DisplayOrders } from "../../components/DisplayOrders";
import { useTranslation } from "react-i18next";

export const SellerOrders = () => {
  const { orders } = useOrders();
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();

  const filteredOrders = orders
  .filter((o) => {
    const s = searchText.toLowerCase();
    return (
      o.customerId.firstname.toLowerCase().includes(s) ||
      o.customerId.lastname.toLowerCase().includes(s) ||
      o.customerId.email.toLowerCase().includes(s) ||
      o.customerId.city.toLowerCase().includes(s) ||
      o.customerId.country.toLowerCase().includes(s) ||
      o.requestId._id.toLowerCase().includes(s) ||
      o._id.toLowerCase().includes(s)
    );
  })
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <h1>{t("allOrders")}</h1>

      <section className="searchFieldSection">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="searchField"
            type="text"
            placeholder={t("searchOrders")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </section>

      <section>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((o) => <DisplayOrders key={o._id} o={o} />)
        ) : (
          <p className="intro centerText">{t("noMatchOrder")}</p>
        )}
      </section>
    </>
  );
};

import { useState } from "react";
import { useRequest } from "../../hooks/useRequests";
import { DisplayRequests } from "../../components/DisplayRequests";
import { useTranslation } from "react-i18next";

export const SellerRequests = () => {
  const { requests } = useRequest();
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();

  const filteredRequests = requests
  .filter((r) => {
    const s = searchText.toLowerCase();
    return (
      r.customerId.firstname.toLowerCase().includes(s) ||
      r.customerId.lastname.toLowerCase().includes(s) ||
      r.customerId.email.toLowerCase().includes(s) ||
      r.customerId.city.toLowerCase().includes(s) ||
      r.customerId.country.toLowerCase().includes(s) ||
      r._id.toLowerCase().includes(s)
    );
  })
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const statusMap: Record<string, string> = {
    requested: t("requested"),
    approved: t("approved"),
    paid: t("paid"),
  };

  return (
    <>
      <h1>{t("allRequests")}</h1>

      <section className="searchFieldSection">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="searchField"
            type="text"
            placeholder={t("requestsSearch")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </section>

        <section className="colorDescribe">
        <div className="show requested">{statusMap.requested}</div>
        <div className="show approved">{statusMap.approved}</div>
        <div className="show paid">{statusMap.paid}</div>
      </section>

      <section>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((r) => <DisplayRequests key={r._id} r={r} />)
        ) : (
          <p className="intro centerText">{t("noMatch")}</p>
        )}
      </section>
    </>
  );
};

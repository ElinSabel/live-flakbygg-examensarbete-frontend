import { useState } from "react";
import { DisplayCustomers } from "../../components/DisplayCustomers";
import { useCustomers } from "../../hooks/useCustomers";
import { useTranslation } from "react-i18next";

export const SellerCustomers = () => {
  const { t } = useTranslation();
  const { customers, loading } = useCustomers();
  const [searchText, setSearchText] = useState("");

  const filteredCustomers = customers.filter((c) => {
    if (c.role === "seller") return false;

    const s = searchText.toLowerCase();

    return (
      c.firstname.toLowerCase().includes(s) ||
      c.lastname.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.phone.toLowerCase().includes(s) ||
      c.city.toLowerCase().includes(s) ||
      c.country.toLowerCase().includes(s)
    );
  });

  return (
    <>
      <h1>{t("allCustomers")}</h1>

      {loading && <h2>{t("loading")}</h2>}

      <section className="searchFieldSection">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="searchField"
            type="text"
            placeholder={t("searchCustomers")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </section>

      <section>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((c) => <DisplayCustomers key={c._id} c={c} />)
        ) : (
          <p className="intro centeredText">{t("noMatchCustomer")}</p>
        )}
      </section>
    </>
  );
};
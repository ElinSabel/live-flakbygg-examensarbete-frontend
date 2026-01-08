import { Customer } from "../models/Customer";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

interface IDisplayCustomersProps {
  c: Customer;
}

export const DisplayCustomers = ({ c }: IDisplayCustomersProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToDetails = () => {
    navigate(`/seller/customer/${c._id}`);
  };

  return (
    <div className="card customer" onClick={goToDetails}>
      <h3>
        {c.firstname} {c.lastname}
      </h3>

      <div className="requestInfo">
        <p>
          <strong>{t("placeholderEmail")}:</strong> {c.email}
        </p>
        <p>
          <strong>{t("placeholderPhone")}:</strong> {c.phone}
        </p>
        <p>
          <strong>{t("placeholderCity")}:</strong> {c.city}
        </p>
        <p>
          <strong>{t("placeholderCountry")}:</strong> {c.country}
        </p>
      </div>
    </div>
  );
};
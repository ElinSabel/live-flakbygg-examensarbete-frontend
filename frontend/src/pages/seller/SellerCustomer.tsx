import { FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCustomers } from "../../hooks/useCustomers";
import { ICustomerUpdate } from "../../models/Customer";
import { CountrySelect } from "../../components/CountrySelect";
import { useTranslation } from "react-i18next";

export const SellerCustomer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    customer,
    loading,
    error,
    fetchCustomerByIdHandler,
    updateCustomerHandler,
    deleteCustomerHandler,
  } = useCustomers();

  const [payload, setPayload] = useState<ICustomerUpdate | null>(null);

  useEffect(() => {
    if (id) fetchCustomerByIdHandler(id);
  }, [id]);

  useEffect(() => {
    if (customer) {
      setPayload({ ...customer });
    }
  }, [customer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!payload || !customer) return;

    try {
      await updateCustomerHandler(customer._id, payload);
      setSuccessMessage(t("customerUpdatedCorrectly"));
    } catch (err: any) {
      setErrorMessage(err.message || t("updateFailed"));
    }
  };

  if (!id) return <p>{t("invalidCustomerId")}</p>;
  if (loading) return <p>{t("loading")}</p>;
  if (error) {
    setErrorMessage(error);
    return <p className="message error">{error}</p>;
  }
  if (!customer || !payload) return <p>{t("noCustomerFound")}</p>;

  return (
    <>
      {errorMessage && <p className="message error">{errorMessage}</p>}
      {successMessage && <p className="message success">{successMessage}</p>}

      <h1>
        {customer.firstname} {customer.lastname}
      </h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="formDiv">
          <h3 className="centerText">{t("customerInformation")}</h3>
          <input
            name="firstname"
            value={payload.firstname}
            placeholder={t("placeholderFirstName")}
            onChange={(e) =>
              setPayload({ ...payload, firstname: e.target.value })
            }
          />
          <input
            name="lastname"
            value={payload.lastname}
            placeholder={t("placeholderLastName")}
            onChange={(e) =>
              setPayload({ ...payload, lastname: e.target.value })
            }
          />
          <input
            name="email"
            value={payload.email}
            placeholder={t("placeholderEmail")}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
          />
          <input
            name="phone"
            value={payload.phone}
            placeholder={t("placeholderPhone")}
            onChange={(e) => setPayload({ ...payload, phone: e.target.value })}
          />

          <h3 className="centerText">{t("shippingInformation")}</h3>
          <input
            name="streetAddress"
            value={payload.streetAddress}
            placeholder={t("placeholderAddress")}
            onChange={(e) =>
              setPayload({ ...payload, streetAddress: e.target.value })
            }
          />
          <input
            name="postalCode"
            value={payload.postalCode}
            placeholder={t("placeholderPostalCode")}
            onChange={(e) =>
              setPayload({ ...payload, postalCode: e.target.value })
            }
          />
          <input
            name="city"
            value={payload.city}
            placeholder={t("placeholderCity")}
            onChange={(e) => setPayload({ ...payload, city: e.target.value })}
          />
          <select
            value={payload.country}
            onChange={(e) =>
              setPayload({ ...payload, country: e.target.value })
            }
          >
            <CountrySelect />
          </select>
        </div>

        <div className="buttonSection">
          <button className="btn update" type="submit">
            {t("update")}
          </button>
          <button
            className="btn delete"
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            {t("delete")}
          </button>
        </div>
      </form>
      
{showDeleteModal && (
  <div className="deleteOverlay">
    <div
      className="card">
      <h2>{t("confirmDeleteCustomer")}</h2>

      <p className="intro centerText">
        {customer.firstname} {customer.lastname}
        <br/>
        {customer.email}
      </p>

      <div className="buttonSection">
        <button
          className="btn update"
          type="button"
          onClick={() => setShowDeleteModal(false)}
        >
          {t("cancel")}
        </button>

        <button
          className="btn delete"
          type="button"
          onClick={async () => {
            await deleteCustomerHandler(customer._id);
            navigate(-1);
          }}
        >
          {t("delete")}
        </button>
      </div>
    </div>
  </div>
)}
      <button className="backBtn" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>
    </>
  );
};

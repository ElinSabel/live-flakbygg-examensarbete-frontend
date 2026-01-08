import { FormEvent, useEffect, useState } from "react";
import { ICustomerCreate } from "../models/Customer";
import { useCustomers } from "../hooks/useCustomers";
import { CountrySelect } from "./CountrySelect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function isStrongPassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;
  return passwordRegex.test(password);
}

const defaultPayload: ICustomerCreate = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
  streetAddress: "",
  postalCode: "",
  city: "",
  country: "",
  role: "customer",
};

export const CreateCustomer = () => {
  const { createCustomerHandler } = useCustomers();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [payload, setPayload] = useState<ICustomerCreate>(() => {
    const cachedCustomer = localStorage.getItem("customer");
    return cachedCustomer ? JSON.parse(cachedCustomer) : defaultPayload;
  });
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem("customer", JSON.stringify(payload));
  }, [payload]);

  const handleChange = (key: keyof ICustomerCreate, value: string) => {
  const normalizedValue =
    key === "email" ? value.trim().toLowerCase() : value.trim();

  setPayload((prev) => {
    const updatedPayload = { ...prev, [key]: normalizedValue };
    localStorage.setItem("customer", JSON.stringify(updatedPayload));
    return updatedPayload;
  });
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isValidEmail(payload.email)) {
      setErrorMessage(t("wrongEmail"));
      window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
      return;
    }

    if (!isStrongPassword(payload.password)) {
      setErrorMessage(t("wrongPassword"));
      window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
      return;
    }
    const result = await createCustomerHandler(payload);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setPayload(defaultPayload);
    setSuccessMessage(t("createdUser"));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2500);
  };


  return (
    <>
      {errorMessage && (
        <p className="message error centerText">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="message success centerText">{successMessage}</p>
      )}
     <form className="form" onSubmit={handleSubmit}>
  <section className="card">
    <div className="formDiv">
      <h2>
        <i>{t("customerInformation")}</i>
      </h2>

      <label htmlFor="firstname">{t("placeholderFirstName")}</label>
      <input
        id="firstname"
        required
        maxLength={100}
        value={payload.firstname}
        onChange={(e) => handleChange("firstname", e.target.value)}
      />

      <label htmlFor="lastname">{t("placeholderLastName")}</label>
      <input
        id="lastname"
        required
        maxLength={100}
        value={payload.lastname}
        onChange={(e) => handleChange("lastname", e.target.value)}
      />

      <label htmlFor="email">{t("placeholderEmail")}</label>
      <input
        id="email"
        type="email"
        required
        maxLength={200}
        value={payload.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <label htmlFor="password">{t("placeholderPassword")}</label>
      <input
        id="password"
        type="password"
        required
        maxLength={60}
        value={payload.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <label htmlFor="phone">{t("placeholderPhone")}</label>
      <input
        id="phone"
        required
        maxLength={30}
        value={payload.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
      />
    </div>
</section>
<section className="card">
    <div className="formDiv">
      <h2>
        <i>{t("shippingInformation")}</i>
      </h2>

      <label htmlFor="streetAddress">{t("placeholderAddress")}</label>
      <input
        id="streetAddress"
        required
        maxLength={100}
        value={payload.streetAddress}
        onChange={(e) => handleChange("streetAddress", e.target.value)}
      />

      <label htmlFor="postalCode">{t("placeholderPostalCode")}</label>
      <input
        id="postalCode"
        required
        maxLength={30}
        value={payload.postalCode}
        onChange={(e) => handleChange("postalCode", e.target.value)}
      />

      <label htmlFor="city">{t("placeholderCity")}</label>
      <input
        id="city"
        required
        maxLength={50}
        value={payload.city}
        onChange={(e) => handleChange("city", e.target.value)}
      />

      <label htmlFor="country">{t("placeholderCountry")}</label>
      <select
        id="country"
        required
        value={payload.country}
        onChange={(e) => handleChange("country", e.target.value)}
      >
        <CountrySelect />
      </select>
    </div>
  </section>

  <button className="btn secondary" type="submit">
    {t("register")}
  </button>
</form>
    </>
  );
};

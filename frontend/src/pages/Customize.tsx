import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { CreateCustomer } from "../components/CreateCustomer";
import { CreateRequest } from "../components/CreateRequest";
import { useTranslation } from "react-i18next";

export const Customize = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return <p>{t("loading")}</p>;
  }

  if (!user) {
    return (
      <>
        <h1>{t("customize")}</h1>
        <p className="intro centerText">{t("customizeTextSecond")}</p>

        <button className="btn primary" onClick={() => navigate("/login")}>
          {t("alreadyCustomer")} {t("login")}
        </button>
        <CreateCustomer />
      </>
    );
  }

  if (user.role !== "customer") {
    return (
      <>
        <h1>{t("customize")}</h1>
        <p className="intro centerText">
          {t("onlyCustomersCanCustomize")}
        </p>
      </>
    );
  }

  return (
    <>
      <h1>{t("customize")}</h1>
      <p className="intro centerText">{t("customizeText")}</p>
      <CreateRequest customerId={user._id} />
    </>
  );
};
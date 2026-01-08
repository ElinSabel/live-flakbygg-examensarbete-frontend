import { useTranslation } from "react-i18next";
import { CreateCustomer } from "../components/CreateCustomer";

export const Register = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("register")}</h1>
      <CreateCustomer />
    </>
  );
};

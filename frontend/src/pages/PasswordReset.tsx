import { FormEvent, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_URL } from "../services/baseService";
import { useTranslation } from "react-i18next";

function isStrongPassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;
  return passwordRegex.test(password);
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

 if (!isStrongPassword(password)) {
      setErrorMessage(t("wrongPassword"));
      return;
    }
    
    try {
      const res = await axios.post(`${API_URL}/auth/password/reset`, {
        token,
        password,
      });
      setSuccessMessage(res.data.message || (t("resetSuccesful")));
      setErrorMessage(null)
      setPassword("")
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error || (t("resetUnsuccesful"));
      setErrorMessage(errMsg);
    }
  };

  return (
    <>
      <h2>{t("resetPassword")}</h2>
     {errorMessage && <p className="message error">{errorMessage}</p>}
      {successMessage && <p className="message success">{successMessage}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="formDiv">
        <input
          type="password"
          placeholder={t("resetPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="primary btn" type="submit">{t("resetPassword")}</button>
        </div>
      </form>
    </>
  );
}

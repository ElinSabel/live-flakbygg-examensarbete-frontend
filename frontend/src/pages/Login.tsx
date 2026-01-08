import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../services/baseService";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const user = await login(normalizedEmail, password);

      switch (user.role) {
        case "customer":
          navigate("/customer");
          break;
        case "seller":
          navigate("/seller");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      setErrorMessage(error.message || t("loginError"));
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await axios.post(`${API_URL}/auth/password/request`, {
        email: email.trim().toLowerCase(),
      });
      setSuccessMessage(res.data.message);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || t("resetError"));
    }
  };

  return (
    <>
      <h1>{t("login")}</h1>

      {errorMessage && <p className="message error centerText">{errorMessage}</p>}
      {successMessage && <p className="message success centerText">{successMessage}</p>}

      {!showResetForm ? (
        <form className="form" onSubmit={handleLoginSubmit}>
          <div className="formDiv">
            <input
              type="email"
              placeholder={t("placeholderEmailLogin")}
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
            />
            <input
              type="password"
              placeholder={t("placeholderPasswordLogin")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn primary" type="submit">
            {t("login")}
          </button>

          <div>
            <br />
            <NavLink to="/register">
              <p className="intro centerText">{t("register")}</p>
            </NavLink>

            <br />

            <button
              className="backBtn"
              type="button"
              onClick={() => setShowResetForm(true)}
            >
              {t("forgotPassword")}
            </button>
          </div>
        </form>
      ) : (
        <form className="form" onSubmit={handlePasswordReset}>
          <div className="formDiv">
            <input
              type="email"
              placeholder={t("placeholderEmailLogin")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <section>
            <button className="btn primary" type="submit">
              {t("sendReset")}
            </button>
            <button
              className="backBtn"
              type="button"
              onClick={() => setShowResetForm(false)}
            >
              ← {t("back")}
            </button>
          </section>
        </form>
      )}
    </>
  );
};

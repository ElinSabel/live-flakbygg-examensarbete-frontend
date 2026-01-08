import { Outlet, NavLink, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Logo from "../assets/logo.png";
import LogoFooter from "../assets/logo-footer.png";

export const Layout = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const publicLinks = (
    <>
      <NavLink to="/customize">{t("customize")}</NavLink>
      <NavLink to="/order-process">{t("orderProcess")}</NavLink>
      <NavLink to="/gallery">{t("gallery")}</NavLink>
      <NavLink to="/about">{t("about")}</NavLink>
    </>
  );

  const customerLinks = (
    <>
      <NavLink to="/customer">{t("dashboard")}</NavLink>
      <NavLink to="/customize">{t("customize")}</NavLink>
      <NavLink to="/order-process">{t("orderProcess")}</NavLink>
      <NavLink to="/gallery">{t("gallery")}</NavLink>
      <NavLink to="/about">{t("about")}</NavLink>
    </>
  );

  const sellerLinks = (
    <>
      <NavLink to="/seller">{t("dashboard")}</NavLink>
      <NavLink to="/seller/requests">{t("requests")}</NavLink>
      <NavLink to="/seller/orders">{t("orders")}</NavLink>
      <NavLink to="/seller/customers">{t("customers")}</NavLink>
    </>
  );

  return (
    <>
      <header>
        <NavLink to="/">
          <img className="logo" src={Logo} alt="Logo" />
        </NavLink>
        <button
          className="burger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`navigation ${menuOpen ? "open" : ""}`}>
          <button
            className="closeMenu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          {user ? (
            <>
              {user.role === "customer" && customerLinks}
              {user.role === "seller" && sellerLinks}

              <NavLink to="/" onClick={logout} className="login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 40 40"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </NavLink>
            </>
          ) : (
            <>
              {publicLinks}
              <NavLink to="/login" className="login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 40 40"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </NavLink>
            </>
          )}
        </nav>

        <div className="languageSwitcher">
          <button onClick={() => changeLanguage("sv")}>S V</button>
          <span>|</span>
          <button onClick={() => changeLanguage("en")}>E N G</button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <hr />

      <footer>
        <NavLink to="/">
          <img className="logo" src={LogoFooter} alt="Logo" />
        </NavLink>

        <nav>
          {user ? (
            <>
              {user.role === "customer" && customerLinks}
              {user.role === "seller" && sellerLinks}
            </>
          ) : (
            publicLinks
          )}
        </nav>
        <section>
        <p className="heroNote centerText">contact@flakbygg.com | +4676123123 | Builderstreet 12</p>
        </section>
      </footer>
    </>
  );
};
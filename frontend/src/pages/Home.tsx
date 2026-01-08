import { useTranslation } from "react-i18next";
import heroVideo from "../assets/hero.mp4";

export const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <section>
        <h1>{t("heroTitle")}</h1>
        <p className="intro centerText">{t("heroIntro")}</p>
        <div className="heroVideo">
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="heroVideoElement"
          />
        </div>
        <a href="/customize" className="btn primary">
          {t("heroCTA")}
        </a>
        <p className="heroNote centerText">{t("heroNote")}</p>
      </section>

      <section className="value">
        <h2>{t("valueTitle")}</h2>
        <ul>
          <li><span>✔</span> {t("valueItem1")}</li>
          <li><span>✔</span> {t("valueItem2")}</li>
          <li><span>✔</span> {t("valueItem3")}</li>
          <li><span>✔</span> {t("valueItem4")}</li>
        </ul>
      </section>

      <section className="howItWorks">
        <h2>{t("howItWorksTitle")}</h2>
        <ul>
          <li>
            <strong>{t("howItWorksStep1Title")}</strong> {t("howItWorksStep1Text")}
          </li>
          <li>
            <strong>{t("howItWorksStep2Title")}</strong> {t("howItWorksStep2Text")}
          </li>
          <li>
            <strong>{t("howItWorksStep3Title")}</strong> {t("howItWorksStep3Text")}
          </li>
        </ul>
        <a href="/order-process" className="btn secondary">
          {t("howItWorksCTA")}
        </a>
      </section>

      <section className="formSection">
        <h2>{t("formSectionTitle")}</h2>
        <p className="intro">{t("formSectionIntro")}</p>
        <a href="mailto:contact@flakbygg.com" className="btn tertiary">
          {t("formSectionCTA")}
        </a>
      </section>
    </>
  );
};
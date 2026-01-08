import { useTranslation } from "react-i18next";
import Video from "../assets/turnaround.mp4";

export const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("aboutFlakBygg")}</h1>
      <p className="intro centerText">{t("aboutIntro")}</p>

<div>
          <video
            src={Video}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      <div className="form">
        <section>
          <h3>
            {t("passion-DrivenCraftsmanship")}
          </h3>
          <p>{t("passion-DrivenCraftsmanshipText")}</p>
          <p>{t("passion-DrivenCraftsmanshipTextSecond")}</p>
          <ul>
            <li><span>●</span> {t("passion-DrivenCraftsmanshipItem1")}</li>
            <li><span>●</span> {t("passion-DrivenCraftsmanshipItem2")}</li>
            <li><span>●</span> {t("passion-DrivenCraftsmanshipItem3")}</li>
          </ul>

          <h3>
            {t("fairPricingNoCompromises")}
          </h3>
          <p>{t("fairPricingNoCompromisesText")}</p>
          <p>{t("fairPricingNoCompromisesTextSecond")}</p>

          <h3>
            {t("builtForRealUse")}
          </h3>
          <p>{t("builtForRealUseText")}</p>
          <ul>
            <li><span>●</span> {t("builtForRealUseItem1")}</li>
            <li><span>●</span> {t("builtForRealUseItem2")}</li>
            <li><span>●</span> {t("builtForRealUseItem3")}</li>
            <li><span>●</span> {t("builtForRealUseItem4")}</li>
          </ul>

          <h3>
            {t("differentWayofBuilding")}
          </h3>
          <p>{t("differentWayofBuildingText")}</p>
          <p>{t("differentWayofBuildingTextSecond")}</p>
        </section>
      </div>
    </>
  );
};

import { useTranslation } from "react-i18next";

export const OrderProcess = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("orderProcess")}</h1>

      <p className="intro centerText">{t("orderProcessIntro")}</p>
      <div className="form">

        <section>
          <h4>1. {t("initialInquiry")}</h4>
          <p>{t("initialInquirytext")}</p>

          <h4>2. {t("consultationAndNeedsAssessment")}</h4>
          <p>{t("consultationAndNeedsAssessmenttext")}</p>
          <p>{t("weDiscuss")}:</p>
          <ul>
            <li><span>●</span> {t("weDiscusstext1")}</li>
            <li><span>●</span> {t("weDiscusstext2")}</li>
            <li><span>●</span> {t("weDiscusstext3")}</li>
            <li><span>●</span> {t("weDiscusstext4")}</li>
          </ul>

          <h4>3. {t("designConsultation")}</h4>
          <p>{t("designConsultationtext")}</p>
          <p>{t("proposal")}</p>
          <ul>
            <li><span>●</span> {t("proposalItem1")}</li>
            <li><span>●</span> {t("proposalItem2")}</li>
            <li><span>●</span> {t("proposalItem3")}</li>
            <li><span>●</span> {t("proposalItem4")}</li>
          </ul>
          <p>{t("proposalAdjustments")}</p>

          <h4>4. {t("quotationAndAgreement")}</h4>
          <p>{t("quotationAndAgreementtext")}</p>

          <h4>5. {t("buildProcess")}</h4>
          <p>{t("buildProcesstext")}</p>
          <p>{t("buildProcesstextsecond")}</p>

          <h4>6. {t("deliveryAndHandover")}</h4>
          <p>{t("deliveryAndHandovertext")}</p>
          <p>{t("deliveryAndHandovertextSecond")}</p>

          <h4>7. {t("afterSalesSupport")}</h4>
          <p>{t("afterSalesSupporttext")}</p>
        </section>
      </div>
    </>
  );
};

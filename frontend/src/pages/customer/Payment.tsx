import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";
import { useLocation, Navigate } from "react-router";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  throw new Error("Missing Stripe publishable key. Check your .env file!");
}

const stripePromise = loadStripe(stripeKey);

export const Payment = () => {
  const location = useLocation();
  const clientSecret = location.state?.clientSecret;
   const { t } = useTranslation();

  if (!clientSecret) {
    return <Navigate to="/customer" replace />;
  }

  return (<>
    <h1>{t("completePay")}</h1>
    <form className="form">
    <section className="card">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </section>
    <button className="backBtn">← {t("back")}</button>
    </form>
    </>
  );
};

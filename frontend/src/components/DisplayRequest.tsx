import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../services/baseService";
import { updateRequestPrice } from "../services/requestServices";
import { useAuth } from "../hooks/useAuth";
import { useRequest } from "../hooks/useRequests";
import { IRequestUpdate } from "../models/Request";
import { RequestForm } from "./RequestForm";
import { RequestChat } from "./RequestChat";
import { useTranslation } from "react-i18next";

export const DisplayRequest = () => {
  const { id: requestId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useTranslation();

  const {
    request,
    fetchRequestByIdHandler,
    updateRequestHandler,
    deleteRequestHandler,
    updateSellerRequestHandler,
    updateStatusRequestHandler,
    loading,
    error,
  } = useRequest();

  const [payload, setPayload] = useState<IRequestUpdate | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [price, setPrice] = useState(0);
  const [paying, setPaying] = useState(false);
  

  useEffect(() => {
    if (requestId) fetchRequestByIdHandler(requestId);
  }, [requestId]);

  useEffect(() => {
    if (!request) return;

    setPayload({
      _id: request._id,
      customerId: request.customerId._id,
      dimensions: {
        ...request.dimensions,
        windowOptions: { ...request.dimensions.windowOptions },
      },
      preferences: request.preferences,
      status: request.status,
      sellerId: request.sellerId?._id ?? "",
    });
  }, [request]);

  if (!requestId) return <p>{t("invalidId")}</p>;
  if (loading) return <p>{t("loading")}</p>;
  if (!request || !payload) return <p>{t("noFound")}</p>;
  if (!user) return <p>{t("notAuthorized")}</p>;

  const handleApprove = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateStatusRequestHandler(request._id, { status: "approved" });
      await updateRequestPrice(request._id, { agreedPrice: price });
      setSuccessMessage(t("priceSent"));
    } catch {
      setErrorMessage(error);
    }
  };

  const goToPayment = async () => {
    try {
      setPaying(true);

      const res = await api.post("/stripe/create-embedded-session", {
        requestId
      });

          console.log("Embedded session response:", res.data);
          
      navigate(`/customer/payment/${requestId}`, {
        state: { clientSecret: res.data.clientSecret },
      });
    } catch {
      setErrorMessage(t("paymentFailed"));
      setPaying(false);
    }
  };

  const handleDelete = async () => {
    await deleteRequestHandler(request._id);
    navigate("/dashboard", { replace: true });
  };


  const canPay = request.agreedPrice > 0 && request.status !== "paid";

  return (
    <>
      {errorMessage && <p className="message error centerText">{errorMessage}</p>}
      {successMessage && <p className="message success centerText">{successMessage}</p>}

      <h1>
        {t("request")}
        <br />
        {request._id}
      </h1>

      <section className="infoGrid">
        <div className="infoCard">
          <h2>{t("customerDetails")}</h2>
          <p>
            <strong>{t("name")}:</strong> {request.customerId.firstname}{" "}
            {request.customerId.lastname}
          </p>
          <p>
            <strong>{t("email")}:</strong> {request.customerId.email}
          </p>
          <p>
            <strong>{t("phone")}:</strong> {request.customerId.phone}
          </p>
          <p>
            <strong>{t("address")}:</strong> {request.customerId.streetAddress},{" "}
            {request.customerId.postalCode}, {request.customerId.city} –{" "}
            {request.customerId.country}
          </p>
        </div>

        <div className="infoCard">
          <h2>{t("requestDetails")}</h2>
          <p>
            <strong>{t("status")}:</strong> {t(request.status)}
          </p>
          <p>
            <strong>{t("createdAt")}:</strong>{" "}
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>{t("seller")}:</strong>{" "}
            {request.sellerId?.firstname ?? t("notAssigned")}
          </p>

          {request.status === "paid" && (
            <p>
              <strong>{t("price")}:</strong> {request.agreedPrice} SEK
            </p>
          )}
        </div>
      </section>

      {!request.sellerId && user.role === "seller" && (
        <form className="form">
          <h2>{t("actionRequired")}</h2>
          <section className="card">
            <button
              className="btn tertiary"
              onClick={() =>
                updateSellerRequestHandler(request._id, {
                  sellerId: user._id,
                })
              }
            >
              {t("assign")}
            </button>
          </section>
        </form>
      )}

      {request.status === "assigned" && user.role === "seller" && (
        <form className="form" onSubmit={handleApprove}>
          <h2>{t("actionRequired")}</h2>
          <section className="card">
          <h2>{t("setPrice")}</h2>
              <label>{t("price")}</label>
              <input 
              type="number"
              onChange={(e) => setPrice(+e.target.value)}
            />
          <button className="btn tertiary">{t("approveSendPrice")}</button>
          </section>
        </form>
      )}

      {canPay && user.role === "customer" && (
          <form className="form" onSubmit={handleApprove}>
          <h2>{t("actionRequired")}</h2>
          <section className="card">
        <button className="btn primary" disabled={paying} onClick={goToPayment}>
          {t("pay")} {request.agreedPrice.toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}
        </button>
        </section>
        </form>
      )}
{ request.sellerId && (
      <RequestChat
        requestId={requestId}
        token={token}
        user={user}
        request={request}
      /> 
)}

      <RequestForm
        request={request}
        payload={payload}
        setPayload={setPayload}
        user={user}
        price={price}
        setPrice={setPrice}
        paying={paying}
        setPaying={setPaying}
        onUpdate={updateRequestHandler}
        onDelete={handleDelete}
        onSuccess={setSuccessMessage}
        navigate={navigate}
      />

      <button className="backBtn" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>
    </>
  );
};

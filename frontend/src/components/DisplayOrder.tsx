import { FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useOrders } from "../hooks/useOrders";
import { Order, IOrderUpdate } from "../models/Order";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

const WINDOW_CONFIG = [
  { key: "rightWindow" },
  { key: "leftWindow" },
  { key: "bedWindow" },
  { key: "rearWindow" },
] as const;

export const DisplayOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const {
    order,
    loading,
    fetchOrderByIdHandler,
    updateOrderHandler,
    deleteOrderHandler,
  } = useOrders();

  const [payload, setPayload] = useState<Order | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchOrderByIdHandler(id);
  }, [id]);

  useEffect(() => {
    if (!order) return;
    setPayload(order);
  }, [order]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!payload) return;

    const updateData: IOrderUpdate = {
      amount: payload.amount,
      status: payload.status,
    };

    const updated = await updateOrderHandler(payload._id, updateData);

    if (updated) {
      setSuccessMessage(t("orderUpdated"));
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrorMessage(t("updateFailed"));
    }
  };

  if (!id) return <p>{t("invalidOrderId")}</p>;
  if (loading) return <p>{t("loading")}</p>;
  if (!payload) return <p>{t("preparingOrder")}</p>;

  const dimensions = payload.requestId?.dimensions ?? {};

  const windowOptions = WINDOW_CONFIG.map(({ key }) => {
    const h = dimensions.windowOptions?.[`${key}Height`] ?? 0;
    const l = dimensions.windowOptions?.[`${key}Length`] ?? 0;

    if (h <= 0 && l <= 0) return null;

    return (
      <div className="windowCard" key={key}>
        <h3>{t(key)}</h3>
        <p>
          <strong>{t("height")}:</strong> {h} m
        </p>
        <p>
          <strong>{t("length")}:</strong> {l} m
        </p>
      </div>
    );
  }).filter(Boolean); 
  return (
    <>
      {successMessage && <p className="message success centerText">{successMessage}</p>}
      {errorMessage && <p className="message error centerText">{errorMessage}</p>}

      <section className="orderHeader">
        <div>
          <h1>
            {t("order")}: {payload._id}
          </h1>
          <span className={`orderStatus ${payload.status}`}>
            {t(payload.status)}
          </span>
        </div>

        <div className="orderAmount">
          <span>{t("totalAmount")}:</span>
          <strong>
            {payload.amount.toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}
          </strong>
        </div>
      </section>

      <section className="infoGrid">
        <div className="infoCard">
          <h2>{t("orderDetails")}</h2>
          <div>
            <strong>{t("status")}:</strong> {t(payload.status)}
          </div>
          <div>
            <strong>{t("seller")}:</strong>{" "}
            {payload.sellerId?.firstname ?? t("notAssigned")}
          </div>
          <div>
            <strong>{t("createdAt")}:</strong>{" "}
            {new Date(payload.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="infoCard">
          <h2>{t("customerDetails")}</h2>
          <div>
            <strong>{t("name")}:</strong>{" "}
            {payload.customerId.firstname} {payload.customerId.lastname}
          </div>
          <div>
            <strong>{t("address")}:</strong>{" "}
            {payload.customerId.streetAddress}
          </div>
          <div>
            <strong>{t("city")}:</strong>{" "}
            {payload.customerId.postalCode} {payload.customerId.city}
          </div>
          <div>
            <strong>{t("country")}:</strong> {payload.customerId.country}
          </div>
        </div>
      </section>

      <form className="form">
        <section className="card">
          <h2>{t("requestDetails")}</h2>

          <div className="dimensionGrid">
            <div className="dimensionCard">
              <h3>{t("mainDimensions")}</h3>
              <p>
                <strong>{t("height")}:</strong> {dimensions.height} m
              </p>
              <p>
                <strong>{t("width")}:</strong> {dimensions.width} m
              </p>
              <p>
                <strong>{t("length")}:</strong> {dimensions.length} m
              </p>
            </div>

            <div className="dimensionCard">
              <h3>{t("bed")}</h3>
              <p>
                <strong>{t("bedHeight")}:</strong> {dimensions.bedHeight ?? 0} m
              </p>
              <p>
                <strong>{t("bedLength")}:</strong> {dimensions.bedLength ?? 0} m
              </p>
            </div>

            <div className="dimensionCard">
              <h3>{t("doorDimensions")}</h3>
              <p>
                <strong>{t("placement")}:</strong>{" "}
                {dimensions.doorDimensions?.doorPlacement
                  ? t(dimensions.doorDimensions.doorPlacement)
                  : "-"}
              </p>
              <p>
                <strong>{t("height")}:</strong> {dimensions.doorDimensions?.doorHeight ?? 0} m
              </p>
              <p>
                <strong>{t("width")}:</strong> {dimensions.doorDimensions?.doorWidth ?? 0} m
              </p>
            </div>
          </div>


          {windowOptions.length > 0 && (
            <div className="dimensionCard full">
              <h2>{t("windowOptions")}</h2>
              <div className="fullCardGrid">{windowOptions}</div>
            </div>
          )}

          <div className="dimensionCard full">
            <h3>{t("preferences")}</h3>
            <p>{payload.requestId.preferences ?? "-"}</p>
          </div>
        </section>
      </form>


      {user?.role === "seller" && (
          <form className="form" onSubmit={handleSubmit}>
        <section className="card">
          <h2>{t("manageOrder")}</h2>
            <div className="grid">
              <div className="field">
                <label>{t("amount")}</label>
                <input
                  type="number"
                  value={payload.amount}
                  onChange={(e) =>
                    setPayload({ ...payload, amount: Number(e.target.value) })
                  }
                />
              </div>

              <div className="field">
                <label>{t("status")}</label>
                <select
                  value={payload.status}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      status: e.target.value as Order["status"],
                    })
                  }
                >
                  <option value="created">{t("created")}</option>
                  <option value="processed">{t("processed")}</option>
                  <option value="shipped">{t("shipped")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="cancelled">{t("cancelled")}</option>
                </select>
              </div>
            </div>

            <div className="buttonSection">
              <button className="btn update">{t("update")}</button>
              <button
                type="button"
                className="btn delete"
                onClick={() => {
                  if (window.confirm(t("confirmDeleteOrder"))) {
                    deleteOrderHandler(payload._id);
                    navigate(-1);
                  }
                }}
              >
                {t("delete")}
              </button>
            </div>
        </section>
          </form>
      )}

      <button className="backBtn" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>
    </>
  );
};

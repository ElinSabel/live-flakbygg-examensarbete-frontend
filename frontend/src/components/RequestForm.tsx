import React, { FormEvent, useState, useEffect } from "react";
import { IRequestUpdate } from "../models/Request";
import { useTranslation } from "react-i18next";
import MainDimensions from "../assets/dimensions/main.png";
import BedDimensions from "../assets/dimensions/bed.png";
import DoorDimensions from "../assets/dimensions/door.png";
import WindowDimensions from "../assets/dimensions/window.png";

const WINDOW_KEYS = ["right", "left", "bed", "rear"] as const;

const Field = ({
  label,
  disabled,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  disabled?: boolean;
}) => (
  <div className="field">
    <label>{label}</label>
    <input {...props} disabled={disabled} type="number" step={0.01} />
  </div>
);

type Props = {
  request: any;
  payload: IRequestUpdate;
  setPayload: React.Dispatch<React.SetStateAction<IRequestUpdate | null>>;
  user: any;
  price: number;
  setPrice: (v: number) => void;
  paying: boolean;
  setPaying: (v: boolean) => void;
  onUpdate: Function;
  onDelete: Function;
  onSuccess: (msg: string) => void;
  navigate: any;
};

export const RequestForm = ({
  request,
  payload,
  setPayload,
  user,
  onUpdate,
  onDelete,
  onSuccess,
  navigate,
}: Props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();
  const isSeller = user?.role === "seller";

  const [windows, setWindows] = useState<Record<string, boolean>>({
    right: false,
    left: false,
    bed: false,
    rear: false,
  });

  useEffect(() => {
    if (!payload) return;
    const initialWindows: Record<string, boolean> = {};
    WINDOW_KEYS.forEach((key) => {
      const h = payload.dimensions.windowOptions?.[`${key}WindowHeight`] ?? 0;
      const l = payload.dimensions.windowOptions?.[`${key}WindowLength`] ?? 0;
      initialWindows[key] = h > 0 || l > 0;
    });
    setWindows(initialWindows);
  }, [payload]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!payload) return;
    await onUpdate(request._id, payload);
    onSuccess(t("requestUpdated"));
  };

  const toggleWindow = (key: string, checked: boolean) => {
    setWindows((prev) => ({ ...prev, [key]: checked }));
    if (!checked && payload) {
      setPayload({
        ...payload,
        dimensions: {
          ...payload.dimensions,
          windowOptions: {
            ...payload.dimensions.windowOptions,
            [`${key}WindowHeight`]: 0,
            [`${key}WindowLength`]: 0,
          },
        },
      });
    }
  };

  const isDisabled = request.status === "approved" || request.status === "paid";

  return (
    <form className="form" onSubmit={handleSubmit}>
      <section className="card">
        <h3>{t("mainDimensions")}</h3>
        <img className="dimensionHelp" src={MainDimensions} />
        <div className="grid">
          <Field
            disabled={isDisabled}
            label={t("height")}
            value={payload?.dimensions?.height ?? 0}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: { ...payload!.dimensions, height: +e.target.value },
              })
            }
          />
          <Field
            disabled={isDisabled}
            label={t("width")}
            
            value={payload?.dimensions?.width ?? 0}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: { ...payload!.dimensions, width: +e.target.value },
              })
            }
          />
          <Field
            disabled={isDisabled}
            label={t("length")}
            
            value={payload?.dimensions?.length ?? 0}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: { ...payload!.dimensions, length: +e.target.value },
              })
            }
          />
        </div>

        <img className="dimensionHelp" src={BedDimensions} />
        <div className="grid">
          <Field
            disabled={isDisabled}
            label={t("bedLength")}
            
            value={payload?.dimensions?.bedLength ?? 0}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: {
                  ...payload!.dimensions,
                  bedLength: +e.target.value,
                },
              })
            }
          />
          <Field
            disabled={isDisabled}
            label={t("bedHeight")}
            
            value={payload?.dimensions?.bedHeight ?? 0}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: {
                  ...payload!.dimensions,
                  bedHeight: +e.target.value,
                },
              })
            }
          />
        </div>
      </section>

      <section className="card">
        <h3>{t("doorDimensions")}</h3>
        <img className="dimensionHelp" src={DoorDimensions} />
        <div className="field">
          <label>{t("doorPlacement")}</label>
          <select
            value={
              payload?.dimensions?.doorDimensions?.doorPlacement ?? "right"
            }
            disabled={isDisabled}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: {
                  ...payload!.dimensions,
                  doorDimensions: {
                    ...payload!.dimensions.doorDimensions,
                    doorPlacement: e.target.value as "right" | "left" | "aft",
                  },
                },
              })
            }
          >
            <option value="right">{t("right")}</option>
            <option value="left">{t("left")}</option>
            <option value="aft">{t("aft")}</option>
          </select>
        </div>
        <div className="grid">
          <Field
            disabled={isDisabled}
            label={t("doorWidth")}
            
            value={payload?.dimensions?.doorDimensions?.doorWidth ?? 0}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: {
                  ...payload!.dimensions,
                  doorDimensions: {
                    ...payload!.dimensions.doorDimensions,
                    doorWidth: +e.target.value,
                  },
                },
              })
            }
          />
          <Field
            disabled={isDisabled}
            label={t("doorHeight")}
           
            value={payload?.dimensions?.doorDimensions?.doorHeight ?? 0}
            onChange={(e) =>
              setPayload({
                ...payload!,
                dimensions: {
                  ...payload!.dimensions,
                  doorDimensions: {
                    ...payload!.dimensions.doorDimensions,
                    doorHeight: +e.target.value,
                  },
                },
              })
            }
          />
        </div>
      </section>

      <section className="card">
        <h3>{t("windowOptions")}</h3>
        <img className="dimensionHelp" src={WindowDimensions} />
        <div className="toggleGrid">
          {WINDOW_KEYS.map((key) => (
            <label key={key} className="toggle">
              <input
                type="checkbox"
                disabled={isDisabled}
                checked={windows[key]}
                onChange={(e) => toggleWindow(key, e.target.checked)}
              />
              {t(`${key}Window`)}
            </label>
          ))}
        </div>

        {WINDOW_KEYS.map(
          (key) =>
            windows[key] && (
              <div className="subCard" key={key}>
                <h3>{t(`${key}Window`)}</h3>
                <div className="grid">
                  <Field
                    disabled={isDisabled}
                    label={t("height")}
                   
                    value={
                      payload?.dimensions?.windowOptions?.[
                        `${key}WindowHeight`
                      ] ?? 0
                    }
                    onChange={(e) =>
                      setPayload({
                        ...payload!,
                        dimensions: {
                          ...payload!.dimensions,
                          windowOptions: {
                            ...payload!.dimensions.windowOptions,
                            [`${key}WindowHeight`]: +e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <Field
                    disabled={isDisabled}
                    label={t("length")}
                
                    value={
                      payload?.dimensions?.windowOptions?.[
                        `${key}WindowLength`
                      ] ?? 0
                    }
                    onChange={(e) =>
                      setPayload({
                        ...payload!,
                        dimensions: {
                          ...payload!.dimensions,
                          windowOptions: {
                            ...payload!.dimensions.windowOptions,
                            [`${key}WindowLength`]: +e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            )
        )}
      </section>

      <div className="buttonSection">
        {(request.status === "requested" || request.status === "assigned") && (
          <button className="btn update" type="submit">
            {t("update")}
          </button>
        )}

        {isSeller && (
          <button
            className="btn delete"
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            {" "}
            {t("delete")}
          </button>
        )}

        {showDeleteModal && (
          <div className="deleteOverlay">
            <div className="card">
              <h2>{t("confirmDeleteRequest")}</h2>

              <p className="intro centerText">{request._id}</p>

              <div className="buttonSection">
                <button
                  className="btn update"
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  className="btn delete"
                  type="button"
                  onClick={async () => {
                    await onDelete(request._id);
                    navigate(-1);
                  }}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

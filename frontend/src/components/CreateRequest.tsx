import { FormEvent, useEffect, useState } from "react";
import { IRequestCreate } from "../models/Request";
import { useRequest } from "../hooks/useRequests";
import { useTranslation } from "react-i18next";
import MainDimensions from "../assets/dimensions/main.png";
import BedDimensions from "../assets/dimensions/bed.png";
import DoorDimensions from "../assets/dimensions/door.png";
import WindowDimensions from "../assets/dimensions/window.png";
import { useNavigate } from "react-router";

type CreateRequestProps = {
  customerId: string;
};

const defaultPayload: IRequestCreate = {
  customerId: "",
  dimensions: {
    height: 0,
    width: 0,
    length: 0,
    bedLength: 0,
    bedHeight: 0,
    doorDimensions: {
      doorPlacement: "right",
      doorWidth: 0,
      doorHeight: 0,
    },
    windowOptions: {
      rightWindowHeight: 0,
      rightWindowLength: 0,
      leftWindowHeight: 0,
      leftWindowLength: 0,
      bedWindowHeight: 0,
      bedWindowLength: 0,
      rearWindowHeight: 0,
      rearWindowLength: 0,
    },
  },
  preferences: "",
  status: "requested",
};

const Field = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="field">
    <label>{label}</label>
    <input {...props} type="number" min={0.1} step={0.01} />
  </div>
);

export const CreateRequest = ({ customerId }: CreateRequestProps) => {
  const { t } = useTranslation();
  const { createRequestHandler, error } = useRequest();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [windows, setWindows] = useState({
    right: false,
    left: false,
    bed: false,
    rear: false,
  });

  const [payload, setPayload] = useState<IRequestCreate>(() => {
    const cached = localStorage.getItem("request");
    const base = cached ? JSON.parse(cached) : defaultPayload;
    return { ...base, customerId };
  });

  useEffect(() => {
    setPayload((prev) => ({ ...prev, customerId }));
  }, [customerId]);

  useEffect(() => {
    localStorage.setItem("request", JSON.stringify(payload));
  }, [payload]);

  const updatePayload = (path: string, value: string | number) => {
    setPayload((prev) => {
      const updated = structuredClone(prev);
      const keys = path.split(".");
      let ref: any = updated;

      keys.slice(0, -1).forEach((k) => (ref = ref[k]));
      ref[keys[keys.length - 1]] = value === "" ? 0 : Number(value);

      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const result = await createRequestHandler(payload);
    if (result instanceof Error) {
      setErrorMessage(error);
      return;
    }

    localStorage.removeItem("request");
    setPayload({ ...defaultPayload, customerId });
    setWindows({ right: false, left: false, bed: false, rear: false });
    setSuccessMessage(t("requestCreated"));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2500);
  };

  return (
    <>
      {errorMessage && <p className="message error centerText">{errorMessage}</p>}
      {successMessage && <p className="message success centerText">{successMessage}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <p className="hint">*{t("allDimensionsInMeters")}</p>

        <section className="card">
          <h3>{t("mainDimensions")}</h3>
          <img className="dimensionHelp" src={MainDimensions} />
          <div className="grid">
            <Field
              label={t("height")}
              required
              value={payload.dimensions.height}
              onChange={(e) =>
                updatePayload("dimensions.height", e.target.value)
              }
            />
            <Field
              label={t("width")}
              type="number"
              min={1}
              required
              value={payload.dimensions.width}
              onChange={(e) =>
                updatePayload("dimensions.width", e.target.value)
              }
            />
            <Field
              label={t("length")}
              type="number"
              min={1}
              required
              value={payload.dimensions.length}
              onChange={(e) =>
                updatePayload("dimensions.length", e.target.value)
              }
            />
          </div>
          <img className="dimensionHelp" src={BedDimensions} />
          <div className="grid">
            <Field
              label={t("bedLength")}
              type="number"
              min={0.1}
              value={payload.dimensions.bedLength}
              onChange={(e) =>
                updatePayload("dimensions.bedLength", e.target.value)
              }
            />
            <Field
              label={t("bedHeight")}
              type="number"
              min={0.1}
              value={payload.dimensions.bedHeight}
              onChange={(e) =>
                updatePayload("dimensions.bedHeight", e.target.value)
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
              value={payload.dimensions.doorDimensions.doorPlacement}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    doorDimensions: {
                      ...prev.dimensions.doorDimensions,
                      doorPlacement: e.target.value as "right" | "left" | "aft",
                    },
                  },
                }))
              }
            >
              <option value="right">{t("right")}</option>
              <option value="left">{t("left")}</option>
              <option value="aft">{t("aft")}</option>
            </select>
          </div>

          <div className="grid">
            <Field
              label={t("doorWidth")}
              type="number"
              min={0.5}
              required
              value={payload.dimensions.doorDimensions.doorWidth}
              onChange={(e) =>
                updatePayload(
                  "dimensions.doorDimensions.doorWidth",
                  e.target.value
                )
              }
            />
            <Field
              label={t("doorHeight")}
              type="number"
              min={1.5}
              required
              value={payload.dimensions.doorDimensions.doorHeight}
              onChange={(e) =>
                updatePayload(
                  "dimensions.doorDimensions.doorHeight",
                  e.target.value
                )
              }
            />
          </div>
        </section>

        <section className="card">
          <h3>{t("windowOptions")}</h3>
          <img className="dimensionHelp" src={WindowDimensions} />
          <div className="toggleGrid">
            {(["right", "left", "bed", "rear"] as const).map((key) => (
              <label key={key} className="toggle">
                <input
                  type="checkbox"
                  checked={windows[key]}
                  onChange={(e) =>
                    setWindows((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                />
                {t(`${key}Window`)}
              </label>
            ))}
          </div>

          {windows.right && (
            <div className="subCard">
              <h3>{t("rightWindow")}</h3>
              <div className="grid">
                <Field
                  label={t("height")}
                  type="number"
                  min={0.1}
                  value={payload.dimensions.windowOptions.rightWindowHeight}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.rightWindowHeight",
                      e.target.value
                    )
                  }
                />
                <Field
                  label={t("length")}
                  type="number"
                  value={payload.dimensions.windowOptions.rightWindowLength}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.rightWindowLength",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}

          {windows.left && (
            <div className="subCard">
              <h3>{t("leftWindow")}</h3>
              <div className="grid">
                <Field
                  label={t("height")}
                  value={payload.dimensions.windowOptions.leftWindowHeight}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.leftWindowHeight",
                      e.target.value
                    )
                  }
                />
                <Field
                  label={t("length")}
                  value={payload.dimensions.windowOptions.leftWindowLength}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.leftWindowLength",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}

          {windows.bed && (
            <div className="subCard">
              <h3>{t("bedWindow")}</h3>
              <div className="grid">
                <Field
                  label={t("height")}
                  value={payload.dimensions.windowOptions.bedWindowHeight}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.bedWindowHeight",
                      e.target.value
                    )
                  }
                />
                <Field
                  label={t("length")}
                  value={payload.dimensions.windowOptions.bedWindowLength}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.bedWindowLength",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}

          {windows.rear && (
            <div className="subCard">
              <h3>{t("rearWindow")}</h3>
              <div className="grid">
                <Field
                  label={t("height")}
                  value={payload.dimensions.windowOptions.rearWindowHeight}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.rearWindowHeight",
                      e.target.value
                    )
                  }
                />
                <Field
                  label={t("length")}
                  value={payload.dimensions.windowOptions.rearWindowLength}
                  onChange={(e) =>
                    updatePayload(
                      "dimensions.windowOptions.rearWindowLength",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <h3>{t("preferences")}</h3>
          <textarea
            rows={4}
            placeholder={t("preferencesPlaceholder")}
            value={payload.preferences}
            onChange={(e) =>
              setPayload((prev) => ({ ...prev, preferences: e.target.value }))
            }
          />
        </section>

        <button type="submit" className="btn primary">
          {t("createRequest")}
        </button>
      </form>
    </>
  );
};

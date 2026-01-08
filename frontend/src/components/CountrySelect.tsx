import { useTranslation } from "react-i18next";

export const CountrySelect = () => {
  const { t } = useTranslation();

  const europeanCountries = [
    "albania",
    "andorra",
    "austria",
    "belarus",
    "belgium",
    "bosniaHerzegovina",
    "bulgaria",
    "croatia",
    "cyprus",
    "czechRepublic",
    "denmark",
    "estonia",
    "finland",
    "france",
    "germany",
    "greece",
    "hungary",
    "iceland",
    "ireland",
    "italy",
    "kosovo",
    "latvia",
    "liechtenstein",
    "lithuania",
    "luxembourg",
    "malta",
    "moldova",
    "monaco",
    "montenegro",
    "netherlands",
    "northMacedonia",
    "norway",
    "poland",
    "portugal",
    "romania",
    "sanMarino",
    "serbia",
    "slovakia",
    "slovenia",
    "spain",
    "sweden",
    "switzerland",
    "ukraine",
    "unitedKingdom",
    "vaticanCity",
  ];

  return (
    <>
      <option value="" disabled>
        {t("countrySelection.select")}
      </option>

      {europeanCountries.map((key) => (
        <option key={key} value={key}>
          {t(`countrySelection.${key}`)}
        </option>
      ))}
    </>
  );
};
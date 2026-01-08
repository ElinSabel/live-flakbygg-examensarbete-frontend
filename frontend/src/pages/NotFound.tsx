import { useTranslation } from "react-i18next";

export const NotFound = () => {
    const { t } = useTranslation();
    return (
        <>
            <h1>{t("404")}</h1>
        </>
    )
}
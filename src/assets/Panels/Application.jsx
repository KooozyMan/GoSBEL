import { useTranslation } from "react-i18next";

export default function Application({ name, setName }) {
    const { t } = useTranslation();
    return (
        <div className="application-container">{t('panel_application_name')}<input className="application-input" type="text" value={name} onChange={(e) => setName(e.target.value)}></input></div>
    );
}
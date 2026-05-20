import { useTranslation } from "react-i18next";

export default function Info({ onClose }) {
    const { t } = useTranslation();
    const infoContent = [
        {
            title: t('info_1_title'),
            text: [
                t('info_1_1'),
                t('info_1_2'),
                t('info_1_3'),
            ],
        },
        {
            title: t('info_2_title'),
            text: [
                t('info_2_1'),
                t('info_2_2'),
            ],
        },
    ];

    return (
        <div>
            <div className="info-popup-container">
                <div className="info-container">
                    {infoContent.map((content, index) => (
                        <div key={index} className="content-container">
                            <div className="content-title">{index + 1}. {content.title}</div>
                            {content.text.map((text, subIndex) => (
                                <div key={subIndex} className="text">{text}</div>
                            ))}
                        </div>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>{t('close')}</button>
            </div>
            <div className="overlay" />
        </div>
    );
}
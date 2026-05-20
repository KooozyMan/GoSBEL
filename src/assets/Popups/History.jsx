import { useState, useEffect } from "react";
import binSvg from '../img/bin.svg';
import { useTranslation } from "react-i18next";

export default function History({ onClose, onLoad }) {
    const { t } = useTranslation();
    const [History, setHistory] = useState(JSON.parse(localStorage.getItem('history')) || []);

    useEffect(() => {
        localStorage.setItem('history', JSON.stringify(History));
    }, [History]);

    const updateStorage = (index, e) => {
        e.stopPropagation();
        setHistory(prevHistory =>
            prevHistory.filter((_, jIndex) => jIndex !== index)
        );
    };

    return (
        <div>
            <div className="history-popup-container">
                <div className="history-container">
                    {(History.length > 0) ? History.map((save, index) => (
                        <div key={index} className="history-content-container" onClick={() => { onLoad(save.xml); onClose() }}>
                            <div className="history-app-name">{save.appName}</div>
                            <div className="history-date">{save.date}</div>
                            <button className="history-del" onClick={(e) => updateStorage(index, e)}><img src={binSvg} /></button>
                        </div>
                    )) : <div className="history-empty-container">{t('popup_history_on_empty', { emoji: "¯\\_(ツ)_/¯" })}</div>}
                </div>
                <button className="close-button" onClick={onClose}>{t('close')}</button>
            </div>
            <div className="overlay" />
        </div>
    );
}
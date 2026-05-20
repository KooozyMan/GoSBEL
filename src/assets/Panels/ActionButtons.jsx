import { useState } from "react";
import saveSvg from '../img/save.svg';
import historySvg from '../img/history.svg';
import codeViewerSvg from '../img/code-viewer.svg';
import xmlViewerSvg from '../img/xml-viewer.svg';
import inforSvg from '../img/info.svg';
import { useTranslation } from "react-i18next";

export default function ActionButtons({ onSave, onHistory, onCodeView, onXmlView, onInfo }) {
    const { t } = useTranslation();
    const [Hovered, setHovered] = useState('');
    return (
        <div className="action-buttons">
            <div className="action-div" id="save-btn">
                <button className="action-button" onClick={onSave} onMouseEnter={() => setHovered('save')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={saveSvg} /></button>
                <div className={`info-div  ${Hovered === 'save' ? 'hovered' : ''}`}>{t('panel_actionbuttons_save')}</div>
            </div>
            <div className="action-div" id="History-btn">
                <button className="action-button" onClick={onHistory} onMouseEnter={() => setHovered('load')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={historySvg} /></button>
                <div className={`info-div  ${Hovered === 'load' ? 'hovered' : ''}`}>{t('panel_actionbuttons_history')}</div>
            </div>
            <div className="action-div" id="GenerateCode-btn">
                <button className="action-button" onClick={onCodeView} onMouseEnter={() => setHovered('code')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={codeViewerSvg} /></button>
                <div className={`info-div  ${Hovered === 'code' ? 'hovered' : ''}`}>{t('panel_actionbuttons_code_viewer')}</div>
            </div>
            <div className="action-div" id="GenerateXml-btn" >
                <button className="action-button" onClick={onXmlView} onMouseEnter={() => setHovered('xml')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={xmlViewerSvg} /></button>
                <div className={`info-div  ${Hovered === 'xml' ? 'hovered' : ''}`}>{t('panel_actionbuttons_xml')}</div>
            </div>
            <div className="action-div" id="info-btn">
                <button className="action-button" onClick={onInfo} onMouseEnter={() => setHovered('info')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={inforSvg} /></button>
                <div className={`info-div  ${Hovered === 'info' ? 'hovered' : ''}`}>{t('panel_actionbuttons_info')}</div>
            </div>
        </div>
    );
}
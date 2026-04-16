import { useState } from "react";
import saveSvg from '../img/save.svg';
import historySvg from '../img/history.svg';
import codeViewerSvg from '../img/code-viewer.svg';
import xmlViewerSvg from '../img/xml-viewer.svg';
import inforSvg from '../img/info.svg';

export default function ActionButtons({ onSave, onHistory, onCodeView, onXmlView, onInfo }) {
    const [Hovered, setHovered] = useState('');
    return (
        <div className="action-buttons">
            <div className="action-div">
                <button className="action-button" onClick={onSave} onMouseEnter={() => setHovered('save')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={saveSvg} /></button>
                <div className={`info-div  ${Hovered === 'save' ? 'hovered' : ''}`}>Save</div>
            </div>
            <div className="action-div">
                <button className="action-button" onClick={onHistory} onMouseEnter={() => setHovered('load')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={historySvg} /></button>
                <div className={`info-div  ${Hovered === 'load' ? 'hovered' : ''}`}>History</div>
            </div>
            <div className="action-div">
                <button className="action-button" onClick={onCodeView} onMouseEnter={() => setHovered('code')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={codeViewerSvg} /></button>
                <div className={`info-div  ${Hovered === 'code' ? 'hovered' : ''}`}>Generate Code</div>
            </div>
            <div className="action-div">
                <button className="action-button" onClick={onXmlView} onMouseEnter={() => setHovered('xml')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={xmlViewerSvg} /></button>
                <div className={`info-div  ${Hovered === 'xml' ? 'hovered' : ''}`}>Generate Xml</div>
            </div>
            <div className="action-div">
                <button className="action-button" onClick={onInfo} onMouseEnter={() => setHovered('info')} onMouseLeave={() => setHovered()}><img className="action-button-img" src={inforSvg} /></button>
                <div className={`info-div  ${Hovered === 'info' ? 'hovered' : ''}`}>Info</div>
            </div>
        </div>
    );
}
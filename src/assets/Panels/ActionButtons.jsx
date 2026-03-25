import { useState } from "react";

export default function ActionButtons({ onQuickSave, onQuickLoad, onCodeView, onXmlView }) {
    const [Hovered, setHovered] = useState('');
    return (
        <div className="action-buttons">
            <div className="action-div">
                <button className="action-button" onClick={onQuickSave} onMouseEnter={() => setHovered('save')} onMouseLeave={() => setHovered()}><img className="action-button-img" src="/src/assets/img/save.svg"></img></button>
                <div className={`info-div  ${Hovered === 'save' ? 'hovered' : ''}`}>Quick Save</div>
            </div>
            <div className="action-div">
                <button className="action-button" onClick={onQuickLoad} onMouseEnter={() => setHovered('load')} onMouseLeave={() => setHovered()}><img className="action-button-img" src="/src/assets/img/load.svg"></img></button>
                <div className={`info-div  ${Hovered === 'load' ? 'hovered' : ''}`}>Quick Load</div>
            </div>
            <div className="action-div">
                <button className="action-button" onClick={onCodeView} onMouseEnter={() => setHovered('code')} onMouseLeave={() => setHovered()}><img className="action-button-img" src="/src/assets/img/code-viewer.svg"></img></button>
                <div className={`info-div  ${Hovered === 'code' ? 'hovered' : ''}`}>View Code</div>
            </div>
            <div className="action-div">
                <button className="action-button" onClick={onXmlView} onMouseEnter={() => setHovered('xml')} onMouseLeave={() => setHovered()}><img className="action-button-img" src="/src/assets/img/xml-viewer.svg"></img></button>
                <div className={`info-div  ${Hovered === 'xml' ? 'hovered' : ''}`}>View Xml</div>
            </div>
        </div>
    );
}
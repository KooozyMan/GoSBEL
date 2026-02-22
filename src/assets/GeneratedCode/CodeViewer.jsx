import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java"
import { oneDark } from "@codemirror/theme-one-dark";
import { useState } from "react";

export default function CodeViewer({ onClose, generatedCode }) {
    const [ViewedCode, setViewedCode] = useState(generatedCode.Entities[0].code);
    return (
        <div className="code-viewer">

            <div className="files">
                <div className="folder">Entities 
                    {generatedCode.Entities.map((entity, index) => (
                        <div key={index} className={`file ${ViewedCode === entity.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(entity.code)}>{entity.fileName}</div>
                    ))}
                </div>
                <div className="folder">Controllers
                    {generatedCode.Controllers.map((controller, index) => (
                        <div key={index} className={`file ${ViewedCode === controller.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(controller.code)}>{controller.fileName}</div>
                    ))}
                </div>
                <div className="folder">Repositories
                    {generatedCode.Repositories?.map((repository, index) => (
                        <div key={index} className={`file ${ViewedCode === repository.code ? 'selected' : ''}`}
                        onClick={() => setViewedCode(repository.code)}>{repository.fileName}</div>
                    ))}
                </div>
                <div className="folder">Services
                    {generatedCode.Services.map((service, index) => (
                        <div key={index} className={`file ${ViewedCode === service.code ? 'selected' : ''}`}
                        onClick={() => setViewedCode(service.code)}>{service.fileName}</div>
                    ))}
                </div>
            </div>
            <div className="code">
                <CodeMirror
                    value={ViewedCode}
                    extensions={[java()]}
                    height="100%"
                    theme={oneDark}
                />
            </div>
            <button onClick={onClose} className="close-code-viewer-button">X</button>
        </div>
    );
}
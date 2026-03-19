import { useState } from "react";
import { Editor } from "@monaco-editor/react";

export default function CodeViewer({ onExport, onClose, generatedCode }) {
    const [ViewedCode, setViewedCode] = useState(generatedCode.Application[0].code);
    return (
        <div className="code-viewer">

            <div className="files">
                <div className="folder">
                    <span className="folder-name">Application</span>
                    {generatedCode.Application.map((application, index) => (
                        <div key={index} className={`file ${ViewedCode === application.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(application.code)}>{application.fileName}</div>
                    ))}
                </div>
                <div className="folder">
                    <span className="folder-name">Entities</span>
                    {generatedCode.Entities.map((entity, index) => (
                        <div key={index} className={`file ${ViewedCode === entity.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(entity.code)}>{entity.fileName}</div>
                    ))}
                </div>
                <div className="folder">
                    <span className="folder-name">Controllers</span>
                    {generatedCode.Controllers.map((controller, index) => (
                        <div key={index} className={`file ${ViewedCode === controller.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(controller.code)}>{controller.fileName}</div>
                    ))}
                </div>
                <div className="folder">
                    <span className="folder-name">Repositories</span>
                    {generatedCode.Repositories?.map((repository, index) => (
                        <div key={index} className={`file ${ViewedCode === repository.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(repository.code)}>{repository.fileName}</div>
                    ))}
                </div>
                <div className="folder">
                    <span className="folder-name">Services</span>
                    {generatedCode.Services.map((service, index) => (
                        <div key={index} className={`file ${ViewedCode === service.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(service.code)}>{service.fileName}</div>
                    ))}
                </div>
            </div>
            <div className="code">
                <Editor
                    height="100%"
                    language="java"
                    value={ViewedCode}
                    theme="vs-dark"
                    options={{
                        readOnly: true, // Set to false if you want editing
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                    }}
                />
            </div>
            <button onClick={onClose} className="close-code-viewer-button">X</button>
            <button onClick={onExport} className="export-code">Export Code</button>
        </div>
    );
}
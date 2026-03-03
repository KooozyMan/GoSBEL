import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java"
import { oneDark } from "@codemirror/theme-one-dark";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";

export default function CodeViewer({ onClose, generatedCode }) {
    const [ViewedCode, setViewedCode] = useState(generatedCode.Entities[0].code);
    return (
        <div className="code-viewer">

            <div className="files">
                <div className="folder">
                    <span className="folder_name">Entities</span> 
                    {generatedCode.Entities.map((entity, index) => (
                        <div key={index} className={`file ${ViewedCode === entity.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(entity.code)}>{entity.fileName}</div>
                    ))}
                </div>
                <div className="folder">
                    <span className="folder_name">Controllers</span>
                    {generatedCode.Controllers.map((controller, index) => (
                        <div key={index} className={`file ${ViewedCode === controller.code ? 'selected' : ''}`}
                            onClick={() => setViewedCode(controller.code)}>{controller.fileName}</div>
                    ))}
                </div>
                <div className="folder">
                    <span className="folder_name">Repositories</span>
                    {generatedCode.Repositories?.map((repository, index) => (
                        <div key={index} className={`file ${ViewedCode === repository.code ? 'selected' : ''}`}
                        onClick={() => setViewedCode(repository.code)}>{repository.fileName}</div>
                    ))}
                </div>
                <div className="folder">
                    <span className="folder_name">Services</span>
                    {generatedCode.Services.map((service, index) => (
                        <div key={index} className={`file ${ViewedCode === service.code ? 'selected' : ''}`}
                        onClick={() => setViewedCode(service.code)}>{service.fileName}</div>
                    ))}
                </div>
                <button className="download" disabled>Download zip</button>
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
        </div>
    );
}
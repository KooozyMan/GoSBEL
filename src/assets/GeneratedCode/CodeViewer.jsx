import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import nord from '../Themes/Nord.json';
import closedFolderImg from '../img/closed-folder.svg';
import openedFolderImg from '/src/assets/img/opened-folder.svg'; // TODO

export default function CodeViewer({ onExport, onClose, generatedCode }) {
    const [ViewedCode, setViewedCode] = useState(generatedCode.Application[0].code);
    const [ViewedFile, setViewedFile] = useState('application');
    const [monacoLanguage, setMonacoLanguage] = useState('java')
    const capArtifactName = generatedCode.Application[0].fileName.slice(0, -16);
    const smlArtifactName = capArtifactName.toLowerCase();

    // Nord theme, for visual purposes only.
    const defineNordTheme = () => {
        loader.init().then(monaco => {
            monaco.editor.defineTheme('nord', nord);
        });
    };
    useEffect(() => {
        defineNordTheme();
    }, [])
    useEffect(() => {
        if (ViewedFile === 'view') {
            setMonacoLanguage('html');
        }
        else setMonacoLanguage('java');
    }, [ViewedFile])

    return (
        <div className="code-viewer">
            <div className="files-container">
                <div className="files">
                    <div className="folder">
                        <span className={`folder-name  ${ViewedFile === 'application' ? 'selected' : ''}`}><img className="folder-img" src={closedFolderImg}></img>main/java/com.example.{smlArtifactName}</span>
                        {generatedCode.Application.map((application, index) => (
                            <div key={index} className={`file ${ViewedCode === application.code ? 'selected' : ''}`}
                                onClick={() => { setViewedCode(application.code); setViewedFile('application') }}>{application.fileName}</div>
                        ))}

                        <div className="folder">
                            <span className={`folder-name  ${ViewedFile === 'entities' ? 'selected' : ''}`}><img className="folder-img" src={closedFolderImg}></img>Entities</span>
                            {generatedCode.Entities.map((entity, index) => (
                                <div key={index} className={`file ${ViewedCode === entity.code ? 'selected' : ''}`}
                                    onClick={() => { setViewedCode(entity.code); setViewedFile('entities') }}>{entity.fileName}</div>
                            ))}
                        </div>
                        <div className="folder">
                            <span className={`folder-name  ${ViewedFile === 'controllers' ? 'selected' : ''}`}><img className="folder-img" src={closedFolderImg}></img>Controllers</span>
                            {generatedCode.Controllers.map((controller, index) => (
                                <div key={index} className={`file ${ViewedCode === controller.code ? 'selected' : ''}`}
                                    onClick={() => { setViewedCode(controller.code); setViewedFile('controllers') }}>{controller.fileName}</div>
                            ))}
                        </div>
                        <div className="folder">
                            <span className={`folder-name  ${ViewedFile === 'repositories' ? 'selected' : ''}`}><img className="folder-img" src={closedFolderImg}></img>Repositories</span>
                            {generatedCode.Repositories?.map((repository, index) => (
                                <div key={index} className={`file ${ViewedCode === repository.code ? 'selected' : ''}`}
                                    onClick={() => { setViewedCode(repository.code); setViewedFile('repositories') }}>{repository.fileName}</div>
                            ))}
                        </div>
                        <div className="folder">
                            <span className={`folder-name  ${ViewedFile === 'services' ? 'selected' : ''}`}><img className="folder-img" src={closedFolderImg}></img>Services</span>
                            {generatedCode.Services.map((service, index) => (
                                <div key={index} className={`file ${ViewedCode === service.code ? 'selected' : ''}`}
                                    onClick={() => { setViewedCode(service.code); setViewedFile('services') }}>{service.fileName}</div>
                            ))}
                        </div>
                    </div>
                    <div className="folder">
                        <span className={`folder-name  ${ViewedFile === 'view' ? 'selected' : ''}`}><img className="folder-img" src={closedFolderImg}></img>main/resources/templates</span>
                        {generatedCode.Views.filter(view => view.fileName.endsWith('.html')).map((view, index) => (
                            <div key={index} className={`file ${ViewedCode === view.code ? 'selected' : ''}`}
                                onClick={() => { setViewedCode(view.code); setViewedFile('view') }}>{view.fileName}</div>
                        ))}
                    </div>
                    <div className="folder">
                        <span className={`folder-name  ${ViewedFile === 'test' ? 'selected' : ''}`}><img className="folder-img" src={closedFolderImg}></img>test/java/com.exmaple.{smlArtifactName}</span>
                        {generatedCode.Test.map((test, index) => (
                            <div key={index} className={`file ${ViewedCode === test.code ? 'selected' : ''}`}
                                onClick={() => { setViewedCode(test.code); setViewedFile('test') }}>{test.fileName}</div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="code">
                <Editor
                    height="100%"
                    language={monacoLanguage}
                    value={ViewedCode}
                    theme="nord"
                    options={{
                        readOnly: true, // Set to false if you want editing
                        minimap: { enabled: false },
                        fontSize: 14,
                        tabSize: 4,
                        insertSpaces: true,
                        detectIndentation: false,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                    }}
                />
            </div>
            <button onClick={onClose} className="close-code-viewer-button">X</button>
            <button onClick={onExport} className="export-code">Export Code</button>
        </div >
    );
}
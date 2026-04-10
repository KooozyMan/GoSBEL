import { useEffect, useRef } from "react"
import { Editor } from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import nord from '../Themes/Nord.json';


export default function XMLView({ onClose, onLoad, xmlContent }) {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    const handleLoad = () => {
        const currentXML = editorRef.current.getValue();
        onLoad(currentXML);
        onClose();
    };

    const defineNordTheme = () => {
        loader.init().then(monaco => {
            monaco.editor.defineTheme('nord', nord);
        });
    };
    useEffect(() => {
        defineNordTheme();
    }, [])


    return (
        <div>
            <div className="xml-container">
                <div className="xml-code" >
                    <Editor
                        height="100%"
                        language="java"
                        value={xmlContent}
                        theme="nord"
                        onMount={handleEditorDidMount}
                        options={{
                            readOnly: false,
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>
                <footer className="xml-footer">
                    <div className="xml-buttons">
                        <button onClick={onClose}>Close</button>
                        <button onClick={handleLoad}>Load</button>
                    </div>
                </footer>
            </div>
            <div className="overlay" />
        </div>
    );
}
import { useEffect, useRef } from "react"
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { basicSetup } from "codemirror"
import { xml } from "@codemirror/lang-xml"
import { useHotkeys } from "react-hotkeys-hook"

export default function XMLView({ onClose, onLoad, xmlContent }) {
    const editorRef = useRef(null)
    const viewRef = useRef(null)

    // Create editor ONCE
    useEffect(() => {
        if (!editorRef.current) return

        const state = EditorState.create({
            doc: xmlContent || `<Application name="default">\n</Application>`,
            extensions: [basicSetup, xml()]
        })

        viewRef.current = new EditorView({
            state,
            parent: editorRef.current
        })

        return () => viewRef.current?.destroy()
    }, [])

    // Update document when xmlContent changes
    useEffect(() => {
        if (!viewRef.current) return

        const currentDoc = viewRef.current.state.doc.toString()

        if (currentDoc !== xmlContent) {
            viewRef.current.dispatch({
                changes: {
                    from: 0,
                    to: currentDoc.length,
                    insert: xmlContent
                }
            })
        }
    }, [xmlContent])

    const handleLoad = () => {
        const currentXML = viewRef.current.state.doc.toString();
        onLoad(currentXML);
        onClose();
    };

    return (
<div>
    <div className="xml-container">
        <div ref={editorRef} className="xml-code" />
        <footer className="xml-footer">
            <div className="xml-buttons">
                <button onClick={onClose}>Close</button>
                <button onClick={handleLoad}>Load</button>
            </div>
        </footer>
    </div>
    <div className="overlay"/>
</div>
    );
}
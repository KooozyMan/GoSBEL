import { useEffect, useRef } from "react"
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { basicSetup } from "codemirror"
import { xml } from "@codemirror/lang-xml"

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
        <div style={{
            position: "absolute", top: "25%", left: "25%", padding: "20px 0", zIndex: "5",
            width: "800px", minHeight: "450px", background: "grey", borderRadius: "8px",
            display: "flex", flexDirection: "column", justifyContent: "left", alignItems: "center",
            gap: "10px"
        }}>
            <div ref={editorRef} style={{ height: "400px", width: "95%", color: "black", fontSize: "18px" }} />
            <button onClick={onClose}>Close</button>
            <button onClick={handleLoad}>Load</button>
        </div>
    );
}
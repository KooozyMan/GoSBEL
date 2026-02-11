import { useEffect, useRef } from "react"
import { basicSetup, EditorView } from "codemirror"
import { xml } from "@codemirror/lang-xml"

export default function XMLView({ onClose }) {
    const editorRef = useRef(null)
    const viewRef = useRef(null)

    useEffect(() => {
        if (!editorRef.current) return

        // Create editor
        viewRef.current = new EditorView({
            doc: "<Entity>\n</Entity>",
            extensions: [basicSetup, xml()],
            parent: editorRef.current
        })

        // Cleanup when component unmounts
        return () => {
            if (viewRef.current) {
                viewRef.current.destroy()
            }
        }
    }, [])


    return (
        <div style={{
            position: "absolute", top: "25%", left: "25%", padding: "20px 0", zIndex: "5",
            width: "800px", minHeight: "450px", background: "grey", borderRadius: "8px",
            display: "flex", flexDirection: "column", justifyContent: "left", alignItems: "center",
            gap: "10px"
        }}>
            <div ref={editorRef} style={{ height: "400px", width: "95%", color: "black", fontSize: "18px" }} />
            <button onClick={onClose}>Close</button>
        </div>
    );
}
import { Background } from "reactflow";

export default function Confirmation({ type, message }) {
    let style = "";

    if (type === 'error') {
        style = {
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
            overflow: "hidden",
            opacity: "1",
            maxHeight: "200px",
        };

    } else if (type === 'confirmation') {
        style = {
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "4px",
            border: "1px solid #c3e6cb",
            overflow: "hidden",
            opacity: "1",
            maxHeight: "200px",
        };
    }

    return (
        <div style={style}>
            {message}
        </div>
    );
}
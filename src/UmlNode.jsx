export default function UmlNode({ data }) {
    return (
        <div
            style={{
                border: "2px solid black",
                borderRadius: 5,
                background: "grey",
                width: 180,
                fontSize: 12
            }}
        >
            <div
                style={{
                    borderBottom: "2px solid black",
                    padding: 5,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                {data.label}
            </div>

            <div style={{ borderBottom: "1px solid black", padding: 5 }}>
                {data.attributes?.map((attr, i) => (
                    <div key={i}>{attr}</div>
                ))}
            </div>

            <div style={{ padding: 5 }}>
                {data.methods?.map((method, i) => (
                    <div key={i}>{method}</div>
                ))}
            </div>
        </div>
    );
}

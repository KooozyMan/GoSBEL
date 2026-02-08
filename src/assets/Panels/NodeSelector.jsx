export default function NodeSelector({ onCreate }) {
    return (
        <div
            style={{
                height: "650px",
                width: "400px",
                background: "white",
                color: "black",
                padding: "10px",
                fontWeight: "bold",
                borderRadius: "14px",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "10px" }}>Entity Panel</div>
            <div><button onClick={() => onCreate("entity")}>+ Add Entity</button></div>
        </div >
    );
}

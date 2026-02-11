export default function NodeSelector({ onCreate }) {
    const list = [
        'entity',
        'repository',
        'controller',
    ];

    const nodes = list.map((element) => (
        <div key={element} style={{ width: "170px" }}>
            <button onClick={() => onCreate(element)}>+ Add {element.charAt(0).toUpperCase() + element.slice(1)}</button>
        </div>
    ));

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
            <div style={{ display: "flex", flexDirection: "row", gap: "10px", flexWrap: "wrap" }}>{nodes}</div>
        </div >
    );
}

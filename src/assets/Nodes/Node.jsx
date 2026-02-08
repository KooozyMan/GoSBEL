import { Handle, Position } from "reactflow";

export default function Node({ data }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);
    return (
        <div
            style={{
                borderRadius: 5,
                padding: "5px",
                background: "black",
                color: "white",
                width: 180,
                fontSize: 12
            }}
        >
            <div style={{ textAlign: "center" }} >{data.label}</div>
            <div>
                {data.fields?.map((field, i) => (
                    <div key={i}>
                        {field.name} : {field.type}
                    </div>
                ))}
            </div>


            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

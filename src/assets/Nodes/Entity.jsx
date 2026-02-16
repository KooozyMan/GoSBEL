import { Handle, Position, useReactFlow } from "reactflow";
import { useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

export default function Entity({ id, data }) {
    const { setNodes } = useReactFlow();

    const [entityName, setEntityName] = useState(data.label);
    const [fields, setFields] = useState(data.fields || []);

    const updateNodeData = (newLabel, newFields) =>
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? { ...node, data: { ...node.data, label: newLabel, fields: newFields } }
                    : node
            )
        );

    const handleNameChange = (e) => {
        setEntityName(e.target.value);
        updateNodeData(e.target.value, fields);
    };

    const addField = () => {
        const newFields = [...fields, { name: "newField", type: "String" }];
        setFields(newFields);
        updateNodeData(entityName, newFields);
    };

    const deleteField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
        updateNodeData(entityName, newFields);
    };

    const changeFieldName = (index, value) => {
        const newFields = [...fields];
        newFields[index].name = value;
        setFields(newFields);
        updateNodeData(entityName, newFields);
    };

    const changeFieldType = (index, value) => {
        const newFields = [...fields];
        newFields[index].type = value;
        setFields(newFields);
        updateNodeData(entityName, newFields);
    };

    return (
        <div
            style={{
                border: "1px solid #4b5563",
                borderRadius: 8,
                background: "#1f2937",
                color: "#e5e7eb",
                width: 230,
                fontSize: 13,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.25)",
                padding: 10,
            }}
        >
            {/* Entity Title */}
            <div
                style={{
                    background: "#374151",
                    borderRadius: 6,
                    padding: "6px 8px",
                    marginBottom: 10,
                }}
            >
                <input
                    value={entityName}
                    onChange={handleNameChange}
                    placeholder="Entity Name"
                    style={{
                        width: "100%",
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: 14,
                        background: "transparent",
                        color: "#f9fafb",
                        border: "none",
                        outline: "none",
                    }}
                />
            </div>

            {/* Fields */}
            {fields.map((field, index) => (
                <div
                    key={index}
                    style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}
                >
                    <input
                        value={field.name}
                        onChange={(e) => changeFieldName(index, e.target.value)}
                        placeholder="field name"
                        style={{
                            width: "45%",
                            background: "#374151",
                            color: "#e5e7eb",
                            border: "none",
                            padding: "4px 6px",
                            borderRadius: 4,
                        }}
                    />

                    <input
                        value={field.type}
                        onChange={(e) => changeFieldType(index, e.target.value)}
                        placeholder="type"
                        style={{
                            width: "40%",
                            background: "#374151",
                            color: "#e5e7eb",
                            border: "none",
                            padding: "4px 6px",
                            borderRadius: 4,
                        }}
                    />

                    <AiOutlineClose
                        onClick={() => deleteField(index)}
                        style={{
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: 18,
                        }}
                    />
                </div>
            ))}

            {/* Add Field Button */}
            <button
                onClick={addField}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "6px 0",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: "600",
                    marginTop: 6,
                }}
            >
                <AiOutlinePlus />
                Add Field
            </button>

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

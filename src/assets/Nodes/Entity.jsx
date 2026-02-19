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
        <div className="entity-node">
            <div className="entity-title">
                <input
                    value={entityName}
                    onChange={handleNameChange}
                    placeholder="Entity Name"
                    className="entity-title-input"
                />
            </div>

            {fields.map((field, index) => (
                <div key={index} className="entity-field-container">
                    <input
                        value={field.name}
                        onChange={(e) => changeFieldName(index, e.target.value)}
                        placeholder="field name"
                        className="entity-name-input"
                    />

                    <input
                        value={field.type}
                        onChange={(e) => changeFieldType(index, e.target.value)}
                        placeholder="type"
                        className="entity-type-input"
                    />

                    <AiOutlineClose
                        onClick={() => deleteField(index)}
                        className="entity-field-delete"
                    />
                </div>
            ))}

            <button
                onClick={addField}
                className="entity-field-add"
            >
                <AiOutlinePlus />
                Add Field
            </button>

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

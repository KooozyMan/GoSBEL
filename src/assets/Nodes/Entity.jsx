import { Handle, Position, useReactFlow } from "reactflow";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { allowedDataTypes } from "../Lists/AllowedDataTypes";
import gear from '../img/gear.svg'

const Str = ({advanced}) => (
<div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
    <div className="block">
        <div className="flex">
            <input title="Regex" className="entity-type-select nodrag" type="text" placeholder="Regex" />
            <input title="Max Characters" className="entity-type-select nodrag" type="text" placeholder="Max Characters" />
        </div>
        <label>NotNull: <input type="checkbox"/></label>
    </div>
</div>)

const Num = ({advanced}) => (
<div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
    <div className="block">
        <div className="flex">
            <input title="Min" className="entity-type-select nodrag" type="text" placeholder="Min" />
            <input title="Max" className="entity-type-select nodrag" type="text" placeholder="Max" />
        </div>
        <div className="flex">
            <label>NotNull: <input type="checkbox"/></label>
            <label>Positive: <input type="checkbox"/></label>
        </div>
    </div>
</div>)

const Dbl = ({advanced}) => (
<div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
    <div className="block">
        <div className="flex">
            <input title="DecimanMin" className="entity-type-select nodrag" type="text" placeholder="DecimanMin" />
            <input title="DecimanMax" className="entity-type-select nodrag" type="text" placeholder="DecimanMax" />
        </div>
        <div className="flex">
            <label>NotNull:     <input type="checkbox"/></label>
            <label>Positive:    <input type="checkbox"/></label>
        </div>
    </div>
</div>)

const Bool = ({advanced}) => (
<div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
    <label>NotNull: <input type="checkbox"/></label>
</div>)

const fieldLookup = (type,validationState) => {
    switch (type) {
        case 'Integer':return(<Num advanced={validationState}/>);
        case 'String': return(<Str advanced={validationState}/>);
        case 'Long':   return(<Num advanced={validationState}/>);
        case 'Double': return(<Dbl advanced={validationState}/>);
        case 'Boolean':return(<Bool advanced={validationState}/>);
    }
}

export default function Entity({ id, data }) {
    const { setNodes } = useReactFlow();

    const [entityName, setEntityName] = useState(data.label);
    const [fields, setFields] = useState(data.fields || []);
    const [advanced,setAdvanced] = useState(null)

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
        const newFields = [...fields, { name: "newField", type: "String", pk: false }];
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

    const changePrimaryKey = (index, value) => {
        const newFields = [...fields];

        if (value) {
            newFields.forEach((f, i) => {
                if (i !== index) f.pk = false;
            });
        }

        newFields[index].pk = value;

        setFields(newFields);
        updateNodeData(entityName, newFields);
    };

    return (
        <div className={`entity-node ${advanced ? 'advanced' : advanced === false && ''}`}>
            <div className="entity-title">
                <input
                    value={entityName}
                    onChange={handleNameChange}
                    placeholder="Entity Name"
                    className="entity-title-input nodrag"
                />
                <button className="gear" onClick={() => setAdvanced(!advanced)}>
                    <img src={gear} className="gear-img" alt="" />
                </button>
            </div>

            {fields.map((field, index) => (
                <div key={index} className={`entity-field-container ${advanced ? 'expand' : 'shrink'}`}>
                    <div className="fixed-width">
                        <input
                            value={field.name}
                            onChange={(e) => changeFieldName(index, e.target.value)}
                            placeholder="field name"
                            className="entity-name-input nodrag"
                            />
                        <select
                            value={field.type}
                            onChange={(e) => changeFieldType(index, e.target.value)}
                            placeholder="type"
                            className="entity-type-select nodrag"
                            >
                            {allowedDataTypes.map((dataType, index) => (
                                <option key={index} value={dataType}>{dataType}</option>
                            ))}
                        </select>
                        <input
                            id={`entity-pk-checkbox-${id}-${index}`}
                            type="checkbox"
                            checked={field.pk || false}
                            onChange={(e) => changePrimaryKey(index, e.target.checked)}
                            className="entity-pk-checkbox nodrag"
                            />
                        <label htmlFor={`entity-pk-checkbox-${id}-${index}`} className="nodrag" />
                    </div>

                        {fieldLookup(field.type,advanced)}
                    <div className="right-side">
                        <AiOutlineClose
                            onClick={() => deleteField(index)}
                            className="entity-field-delete"
                            />
                    </div>


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

import { Handle, Position, useReactFlow } from "reactflow";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { allowedDataTypes } from "../Lists/AllowedDataTypes";
import gear from '../img/gear.svg'

const Str = ({advanced,validationFunction,fieldName,defaultValues}) => {
    const {Regex = '',MaxCharacters='',NotNull=false} = defaultValues || {};
    return (
    <div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
        <div className="block">
            <div className="flex">
                <input defaultValue={Regex} onChange={(e) => validationFunction(fieldName,'Regex',e.target.value)} title="Regex" className="entity-type-select nodrag" type="text" placeholder="Regex" />
                <input defaultValue={MaxCharacters} onChange={(e) => validationFunction(fieldName,'MaxCharacters',(e.target.value))} title="Max Characters" className="entity-type-select nodrag" type="number" placeholder="Max Characters" />
            </div>
            <label>NotNull:  <input defaultChecked={JSON.parse(NotNull)} onChange={(e) => validationFunction(fieldName,'NotNull',e.target.checked)} type="checkbox"/></label>
        </div>
    </div>)}

const Num = ({advanced,validationFunction,fieldName,defaultValues}) => {
    const {Min = '',Max = '',NotNull = false,Positive = false} = defaultValues || {};
    return (
    <div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
        <div className="block">
            <div className="flex">
                <input defaultValue={Min} type="number" onChange={(e) => validationFunction(fieldName,'Min',(e.target.value))} title="Min" className="entity-type-select nodrag" placeholder="Min" />
                <input defaultValue={Max} type="number" onChange={(e) => validationFunction(fieldName,'Max',(e.target.value))} title="Max" className="entity-type-select nodrag" placeholder="Max" />
            </div>
            <div className="flex">
                <label>NotNull:  <input defaultChecked={JSON.parse(NotNull)} onChange={(e) => validationFunction(fieldName,'NotNull',e.target.checked)} type="checkbox"/></label>
                <label>Positive: <input defaultChecked={JSON.parse(Positive)} onChange={(e) => validationFunction(fieldName,'Positive',e.target.checked)} type="checkbox"/></label>
            </div>
        </div>
    </div>)}

const Dbl = ({advanced,validationFunction,fieldName,defaultValues}) => {
    const {DecimalMin = '',DecimalMax = '',NotNull = false,positive = false} = defaultValues || {};
    return ( 
    <div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
        <div className="block">
            <div className="flex">
                <input defaultValue={DecimalMin} onChange={(e) => validationFunction(fieldName,'DecimalMin',(e.target.value))} title="DecimalMin" className="entity-type-select nodrag" type="number" placeholder="DecimalMin" />
                <input defaultValue={DecimalMax} onChange={(e) => validationFunction(fieldName,'DecimalMax',(e.target.value))} title="DecimalMax" className="entity-type-select nodrag" type="number" placeholder="DecimalMax" />
            </div>
            <div className="flex">
                <label>NotNull:     <input defaultChecked={JSON.parse(NotNull)} onChange={(e) => validationFunction(fieldName,'NotNull',e.target.checked)} type="checkbox"/></label>
                <label>Positive:    <input defaultChecked={JSON.parse(positive)} onChange={(e) => validationFunction(fieldName,'Positive',e.target.checked)} type="checkbox"/></label>
            </div>
        </div>
    </div>)}

const Bool = ({advanced,validationFunction,fieldName, defaultValues}) => {
    const {NotNull = false} = defaultValues || {};
    return (
        <div className={`validation-input nodrag ${advanced ? 'fade-in' : 'fade-out'}`}>
            <label>NotNull: <input defaultChecked={JSON.parse(NotNull)} onChange={(e) => validationFunction(fieldName,'NotNull',e.target.checked)} type="checkbox"/></label>
        </div>)
    }

const fieldLookup = (field,validationState,validationFunction) => {
    const {type,name,validation,pk} = field
    switch (type) {
        case 'Integer':return(<Num defaultValues={validation} fieldName={name} advanced={validationState} validationFunction={validationFunction}/>);
        case 'String': return(<Str defaultValues={validation} fieldName={name} advanced={validationState} validationFunction={validationFunction}/>);
        case 'Long':   return(<Num defaultValues={validation} fieldName={name} advanced={validationState} validationFunction={validationFunction}/>);
        case 'Double': return(<Dbl defaultValues={validation} fieldName={name} advanced={validationState} validationFunction={validationFunction}/>);
        case 'Boolean':return(<Bool defaultValues={validation} fieldName={name} advanced={validationState} validationFunction={validationFunction}/>);
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
        const newFields = [...fields, { name: "newField", type: "String", pk: false, validation:{} }];
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

    const handleValidationChange = (fieldName,validation,value) => {
        let newFields = [...fields];
        const index = newFields.findIndex(field => field.name === fieldName);
        // If value is empty/falsy, delete the key
        if (value === '' || value === null || value === undefined) {
            delete newFields[index].validation[validation];
        } else {
            // Otherwise set the value
            newFields[index].validation[validation] = value;
        }
        setFields(newFields);
        updateNodeData(entityName, newFields);
    }

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

                        {fieldLookup(field,advanced,handleValidationChange)}
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

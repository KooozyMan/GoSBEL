import { useAtom } from "jotai";
import { targetFields,targetName } from "../Helpers/Atoms";
import { useState } from "react";

const Number = ({double}) => (
                    <div className="string-card">
                        <div className="upper">
                            <div className="input-group">
                                <input 
                                    type="number"
                                    placeholder="Min value"
                                    />
                            </div>
                            {double && (
                                <>
                                    <div className="input-group">
                                        <input 
                                            type="number"
                                            placeholder="DecimalMin"
                                            />
                                    </div>
                                    <div className="input-group">
                                        <input 
                                            type="number"
                                            placeholder="DecimalMax"
                                            />
                                    </div>
                                </>
                            )}
                            <div className="input-group">
                                <input 
                                    type="number"
                                    placeholder="Max value"
                                    />
                            </div>
                        </div>
                        <div className="lower">
                            <label><input type="checkbox" /> NotNull</label>
                            <label><input type="checkbox" /> NotBlank</label>
                            <label><input type="checkbox" /> NotEmpty</label>
                            <label><input type="checkbox" /> Positive</label>
                            <label><input type="checkbox" /> PositiveOrZero</label>
                            <label><input type="checkbox" /> Negative</label>
                        </div>
                    </div>
)

const String = () => (
                    <div className="string-card">
                        <div className="upper">
                            <div className="input-group">
                                <input 
                                    type="number"
                                    placeholder="Min characters"
                                    />
                            </div>
                            <div className="input-group">
                                <input 
                                    type="number"
                                    placeholder="Max characters"
                                    />
                            </div>
                            <div className="input-group">
                                <input 
                                    type="text"
                                    placeholder="Regex"
                                    />
                            </div>
                        </div>
                        <div className="lower">
                            <label>
                                <input 
                                    type="checkbox" 
                                    /> Email Format
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    /> URL Format
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    /> NotNull
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    /> NotBlank
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    /> NotEmpty
                            </label>
                        </div>
                    </div>
                )

const Boolean = () => (
                    <div className="boolean-card">
                        <label>
                            <input 
                                type="checkbox"
                            /> NotNull
                        </label>
                        <label>
                            <input 
                                type="checkbox"
                            /> NotBlank
                        </label>
                        <label>
                            <input 
                                type="checkbox"
                            /> NotEmpty
                        </label>
                    </div>
)

export default function InputValidation() {
    const [targetEntityName,setTargetEntityName] = useAtom(targetName)
    const [targetFieldsData,setTargetFieldsData] = useAtom(targetFields)

    return (
        <>
        {targetEntityName !== null && 
            <>
                <div className="input-validation-popup-container no-padding">
                    <div className="input-validation-container">
                        <div className="fields-container">
                            <header>
                                {targetEntityName} Fields
                                <button className="close-validation" onClick={() => {setTargetEntityName(null);}}>X</button>
                            </header>
                            <div className="overflow">
                                {targetFieldsData.map(e => {
                                    return (
                                        <div className="field-card">
                                            <p>{e.name}</p>
                                            {e.type == 'String' && <String />}
                                            {e.type == 'Integer' && <Number />}
                                            {e.type == 'Double' && <Number double={true}/>}
                                            {e.type == 'Long' && <Number />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overlay" />
            </>
        }
        </>
    );
}
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java"
import { oneDark } from "@codemirror/theme-one-dark";
import { useState } from "react";

export default function CodeReview({ onClose, generatedCode }) {
    const [ViewedCode, setViewedCode] = useState(generatedCode.Entities[0].code);
    return (
        <div style={{
            position: 'absolute', top: '0px', left: '0px', height: '100%', width: '100%', backgroundColor: 'black', zIndex: '11',
            display: 'flex',
        }}>

            <div style={{ backgroundColor: 'grey', flexDirection: 'column', width: '400px', padding: '15px 30px', }}>
                <div>Entities
                    {generatedCode.Entities.map((entity, index) => (
                        <div key={index} style={{ backgroundColor: ViewedCode === entity.code ? "#282c34" : "grey", marginLeft: '20px' }}
                            onClick={() => setViewedCode(entity.code)}>{entity.fileName}</div>
                    ))}
                </div>
                <div>Controllers
                    {generatedCode.Controllers.map((controller, index) => (
                        <div key={index} style={{ backgroundColor: ViewedCode === controller.code ? "#282c34" : "grey", marginLeft: '20px' }}
                            onClick={() => setViewedCode(controller.code)}>{controller.fileName}</div>
                    ))}
                </div>
                {/* <div>Repositories
                    {generatedCode.Repositories.map((repository, index) => (
                        <div key={index} style={{ backgroundColor: ViewedCode === repository.code ? "#282c34" : "grey", marginLeft: '20px' }} 
                        onClick={() => setViewedCode(repository.code)}>{repository.fileName}</div>
                    ))}
                </div>
                <div>Services
                    {generatedCode.Services.map((service, index) => (
                        <div key={index} style={{ backgroundColor: ViewedCode === service.code ? "#282c34" : "grey", marginLeft: '20px' }} 
                        onClick={() => setViewedCode(service.code)}>{service.fileName}</div>
                    ))}
                </div> */}
            </div>
            <div style={{ backgroundColor: '#282c34', width: '100%' }}>
                <CodeMirror
                    value={ViewedCode}
                    extensions={[java()]}
                    height="100%"
                    theme={oneDark}
                />
            </div>
            <button onClick={onClose} style={{ position: 'absolute', left: '96%', top: '15px', width: '60px', height: '60px' }}><strong>X</strong></button>
        </div>
    );
}
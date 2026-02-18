import ControllerGenerator from "../CodeGenerator/ControllerCodeGenerator";
import EntityGenerator from "../CodeGenerator/EntityCodeGenerator";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import React, { useState } from 'react';

// IMPORTANT: Set the app element for accessibility
Modal.setAppElement('#root'); // or document.getElementById('root')

export default function CodeReview(){
    const [modalIsOpen, setIsOpen] = useState(false);
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            maxWidth: '500px',
            maxHeight: '500px',
            width: '90%',
            color: 'black',
            borderRadius: '8px'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000
        }
    };
const controller = ControllerGenerator(localStorage.getItem('quick-saved-diagram') || '[]');
    let test = document.createElement('div');

    controller.forEach((e) => {
        let b = document.createElement('button')
        b.textContent = `${e.fileName}.java`
        test.appendChild(b)
    })

    return (
    <div>
      <button onClick={() => setIsOpen(true)}>Code Review</button>
      
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Example Modal"
      >
        
        <h2>Code Review Demo</h2>
        <details>
            <summary>Controller</summary>
            {controller.map((e) => (
                <button onClick={() => console.log(e.code)} key={e.id || e.fileName}>
                {e.fileName}
                </button>
            ))}
        </details>
        <br />
        <button onClick={() => setIsOpen(false)}>Close</button>
      </Modal>
    </div>
    );
}
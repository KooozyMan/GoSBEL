export default function Info({ onClose }) {
    const infoContent = [
        {
            title: 'Shortcuts',
            text: [
                'Esc to close down popups',
                'Ctrl + E to Generate an Entity',
                'Ctrl + C to generate the code',
            ],
        },
        {
            title: 'Convert zip to jar',
            text: [
                'open a terminal on the project\'s root directory.',
                'run .\\mvnw clean package',
                'You will find the jar file in the target/ folder.',
            ],
        },
        {
            title: 'Something else different',
            text: [
                'number 1',
                'number 2',
                'number 3',
            ],
        },
    ];

    return (
        <div>
            <div className="info-popup-container">
                <div className="info-container">
                    {infoContent.map((content, index) => (
                        <div key={index} className="content-container">
                            <div className="content-title">{index + 1}. {content.title}</div>
                            {content.text.map((text, subIndex) => (
                                <div key={subIndex} className="text">{text}</div>
                            ))}
                        </div>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
            <div className="overlay" />
        </div>
    );
}
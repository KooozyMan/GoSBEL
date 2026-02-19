export default function NodeSelector({ onCreate }) {
    const list = [
        'entity',
        'repository',
        'controller',
    ];

    const nodes = list.map((element) => (
        <div key={element} className="node">
            <button onClick={() => onCreate(element)}>+ Add {element.charAt(0).toUpperCase() + element.slice(1)}</button>
        </div>
    ));

    return (
        <div className="node-selector">
            <div className="node-selector-title">Entity Panel</div>
            <div className="nodes">{nodes}</div>
        </div >
    );
}

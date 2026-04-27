import entityImg from '../img/entity.png';

export default function NodeSelector({ onCreate }) {
    const list = [
        { name: 'Entity', img: entityImg },
        // { name: 'Repository', img: entityImg },
        // { name: 'Controller', img: entityImg },
    ];

    const nodes = list.map((element, index) => (
        <div key={index} id={`${element.name}-node`} className="node" onClick={() => onCreate(element.name)}>
            <div></div>
            <span className="node-text">{element.name} Node</span>
            <img className="node-img" src={element.img} />
        </div>
    ));

    return (
        <div className="node-selector">
            <div className="node-selector-title">Entity Panel</div>
            <div className="nodes">{nodes}</div>
        </div >
    );
}

import { useTranslation } from 'react-i18next';
import entityImg from '../img/entity.png';

export default function NodeSelector({ onCreate }) {
    const { t } = useTranslation();
    const list = [
        { name: 'Entity', img: entityImg },
        // { name: 'Repository', img: entityImg },
        // { name: 'Controller', img: entityImg },
    ];

    const nodes = list.map((element, index) => (
        <div key={index} id={`${element.name}-node`} className="node" onClick={() => onCreate(element.name)}>
            <div></div>
            <span className="node-text">{t('panel_nodeselector_' + element.name)}</span>
            <img className="node-img" src={element.img} />
        </div>
    ));

    return (
        <div className="node-selector">
            <div className="nodes">{nodes}</div>
        </div >
    );
}

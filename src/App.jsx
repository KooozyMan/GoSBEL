import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  MiniMap,
  Handle,
  Panel,
  addEdge,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";

import Entity from "./assets/Nodes/Entity";
import EntityGenerator from "./assets/Nodes/EntityGenerator";
import NodeSelector from "./assets/Panels/NodeSelector";
import XMLView from "./assets/Popups/XMLView";

const nodeTypes = { entity: Entity };

const initialNodes = [
  {
    id: "1",
    type: "entity",
    position: { x: 100, y: 100 },
    data: {
      label: "User",
      fields: [
        { name: "id", type: "int" },
        { name: "name", type: "string" },
      ]
    }
  },
  {
    id: "2",
    type: "entity",
    position: { x: 400, y: 250 },
    data: {
      label: "Order",
      fields: [
        { name: "orderId", type: "int" },
        { name: "price", type: "double" },
      ],
    }
  }
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep", label: "label" }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [XmlVisibility, setXmlVisibility] = useState(false);

  const createNode = (nodeType) => {
    let newNode;

    if (nodeType === "entity") newNode = EntityGenerator();
    else { alert(`the node ${nodeType} does not exist`); return }; // fallback

    setNodes((nodes) => [...nodes, newNode]);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    []
  );

  const saveDiagram = () => {
    const diagram = { nodes, edges };
    localStorage.setItem("uml-diagram", JSON.stringify(diagram));
    alert("Diagram saved!");
  };

  const loadDiagram = () => {
    const saved = JSON.parse(localStorage.getItem("uml-diagram"));
    if (saved) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
    }
  };

  const exportXML = () => {
    let xml = `<Application name="default">\n`;
    nodes.forEach((n) => {
      if (n.type === 'entity') {
        xml += `  <Entity id="${n.id}" name="${n.data.label}" x="${n.position.x}" y="${n.position.y}">\n`;

        (n.data.fields).forEach((f) => {
          xml += `    <Field name="${f.name}" type="${f.type}" />\n`
        });
        xml += `  </Entity>\n`;
      }
    });

    // TODO: apply validation to naming and missing inputs
    xml += `</Application>`;
    return xml;
  };

  const handleLoadedXml = (xml) => {
    setXmlVisibility(false);
    let loadedNodes = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    xmlDoc.querySelectorAll("Entity").forEach((e) => {
      const id = e.getAttribute("id");
      const name = e.getAttribute("name");
      const x = parseInt(e.getAttribute("x")) || 200;
      const y = parseInt(e.getAttribute("y")) || 200;
      const fields = Array.from(e.querySelectorAll("Field")).map((f) => {
        return {
          name: f.getAttribute("name"),
          type: f.getAttribute("type")
        };
      });

      loadedNodes.push({
        id: id,
        type: "entity",
        position: { x: x, y: y },
        data: {
          label: name,
          fields: fields,
        }
      });
    });

    // xmlDoc.querySelectorAll("Repository").forEach((e) => {}); // Example

    setNodes(loadedNodes);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ position: "absolute", zIndex: 10, padding: 10 }}>
        <button onClick={saveDiagram}>Save</button>
        <button onClick={loadDiagram}>Load</button>
        <button onClick={() => setXmlVisibility(true)}>Export/Load XML</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-right"><NodeSelector onCreate={createNode} /></Panel>
        {XmlVisibility && <XMLView xmlContent={exportXML()} onClose={() => setXmlVisibility(false)} onLoad={handleLoadedXml} />}
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

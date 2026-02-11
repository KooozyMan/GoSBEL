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

  const createNode = (nodeType) => {
    let newNode;

    if (nodeType === "entity") newNode = EntityGenerator();
    else { alert(`the node ${nodeType} does not exist`); return }; // fallback

    setNodes((nodes) => [...nodes, newNode]);
  };

  nodes.forEach(element => {
    console.log(element.data.fields);
  });

  edges.forEach(element => {
    console.log(element);
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
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
    let xml = `<diagram>\n`;

    nodes.forEach((n) => {
      xml += `  <node id="${n.id}" x="${n.position.x}" y="${n.position.y}">\n`;
      xml += `    <label>${n.data.label}</label>\n`;
      xml += `  </node>\n`;
    });

    edges.forEach((e) => {
      xml += `  <edge id="${e.id}" from="${e.source}" to="${e.target}" />\n`;
    });

    xml += `</diagram>`;

    console.log(xml);
    alert("XML exported to console");
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ position: "absolute", zIndex: 10, padding: 10 }}>
        <button onClick={saveDiagram}>Save</button>
        <button onClick={loadDiagram}>Load</button>
        <button onClick={exportXML}>Export XML</button>
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
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";

import UmlNode from "./UmlNode";

const nodeTypes = { uml: UmlNode };

const initialNodes = [
  {
    id: "1",
    type: "uml",
    position: { x: 100, y: 100 },
    data: {
      label: "User",
      attributes: ["+ id: int", "+ name: string"],
      methods: ["+ login()", "+ logout()"]
    }
  },
  {
    id: "2",
    type: "uml",
    position: { x: 400, y: 250 },
    data: {
      label: "Order",
      attributes: ["+ orderId: int", "+ total: float"],
      methods: ["+ create()", "+ cancel()"]
    }
  }
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "default" }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

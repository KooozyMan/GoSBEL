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
import CrowsFoot from "./assets/Edges/CrowsFoot";
import Confirmation from "./assets/Popups/Confirmation";
import ControllerCodeGenerator from "./assets/CodeGenerator/ControllerCodeGenerator";
import EntityCodeGenerator from "./assets/CodeGenerator/EntityCodeGenerator";
import RepositoryCodeGenerator from "./assets/CodeGenerator/RepositoryCodeGenerator";
import ServiceCodeGenerator from "./assets/CodeGenerator/ServiceCodeGenerator";
import CodeViewer from "./assets/GeneratedCode/CodeViewer";
import ExportWindow from './assets/Popups/ExportWindow';
import Application from './assets/Panels/Application';
import ApplicationCodeGenerator from './assets/CodeGenerator/ApplicationCodeGenerator';
import { useHotkeys } from "react-hotkeys-hook";
import TestCodeGenerator from "./assets/CodeGenerator/TestCodeGenerator";

const nodeTypes = { entity: Entity };
const edgeTypes = { crowsFoot: CrowsFoot };

const initialNodes = [
  {
    id: "1",
    type: "entity",
    position: { x: 100, y: 70 },
    data: {
      label: "User",
      fields: [
        { name: "id", type: "int", pk: true },
        { name: "name", type: "string", pk: false },
      ]
    }
  },
  {
    id: "2",
    type: "entity",
    position: { x: 360, y: 270 },
    data: {
      label: "Order",
      fields: [
        { name: "orderId", type: "int", pk: true },
        { name: "price", type: "double", pk: false },
      ],
    }
  }
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "crowsFoot" }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [XmlVisibility, setXmlVisibility] = useState(false);
  const [ConfirmationVisibility, setConfirmationVisibility] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ type: "", message: "" });
  const [CodeVisibility, setCodeVisibility] = useState(false);
  const [entityId, setEntityId] = useState(3);
  const [ExportWindowVisibility, setExportWindowVisibility] = useState(false);
  const [ApplicationName, setApplicationName] = useState('app');

  const createNode = (nodeType) => {
    let newNode;

    if (nodeType === "entity") {
      newNode = EntityGenerator(entityId.toString());
      setEntityId(entityId + 1);

    } else { // fallback
      alert(`the node ${nodeType} does not exist`);
      return
    };

    setNodes((nodes) => [...nodes, newNode]);
  };

  const onConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: "crowsFoot" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  const confirmationHelper = (type, message, time = 2000) => {
    setConfirmationData({ type: type, message: message });
    setConfirmationVisibility(true);
    setTimeout(() => {
      setConfirmationVisibility(false);
    }, time
    );
  };

  const quickSave = () => {
    localStorage.setItem("quick-saved-diagram", exportXML());
    confirmationHelper('confirmation', 'The diagram has been saved to your browser!');
  };

  const quickLoad = () => {
    const loadedXml = localStorage.getItem("quick-saved-diagram");
    if (loadedXml === "" || loadedXml === null) {
      confirmationHelper('error', 'No Diagram has been saved on this browser.');
      return;
    }

    handleLoadedXml(loadedXml);
    confirmationHelper('confirmation', 'The diagram has been loaded from your browser!');
  };

  const CodeViewerHandler = (flag = true) => {
    if (nodes.length === 0) {
      confirmationHelper('error', 'No Nodes to generate Code from.');
      return;
    }

    const exportedXML = exportXML();
    const generatedCode = {
      Application: ApplicationCodeGenerator(exportedXML),
      Entities: EntityCodeGenerator(exportedXML),
      Controllers: ControllerCodeGenerator(exportedXML),
      Repositories: RepositoryCodeGenerator(exportedXML),
      Services: ServiceCodeGenerator(exportedXML),
      Test: TestCodeGenerator(exportedXML),
    };

    setCodeVisibility(flag);
    return generatedCode;
  };

  const exportXML = () => {
    let xml = `<Application name="${ApplicationName.charAt(0).toUpperCase() + ApplicationName.slice(1)}">\n`;
    nodes.forEach((n) => {
      if (n.type === 'entity') {
        xml += `  <Entity id="${n.id}" name="${n.data.label}" x="${n.position.x}" y="${n.position.y}">\n`;

        (n.data.fields).forEach((f) => {
          xml += `    <Field name="${f.name}" type="${f.type}" pk="${f.pk}" />\n`
        });
        xml += `  </Entity>\n`;
      }
    });

    edges.forEach((e) => {
      const edgeId = e.id
      const relationship = document.getElementById(`edge-${edgeId}`).value
      xml += `  <Edge id="${edgeId}" source="${e.source}" target="${e.target}" relationship="${relationship}">\n`
    })

    // TODO: apply validation to naming and missing inputs
    xml += `</Application>`;
    return xml;
  };

  const exportCode = () => {
    setCodeVisibility(false);
    setExportWindowVisibility(true);
  };

  const handleLoadedXml = (xml) => {
    setXmlVisibility(false);
    let loadedNodes = [];
    let loadedEdges = [];
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

    xmlDoc.querySelectorAll("Edge").forEach((e) => {
      const id = e.getAttribute("id");
      const source = e.getAttribute("source");
      const target = e.getAttribute("target");
      const relationship = e.getAttribute("relationship");
      const type = "crowsFoot";

      loadedEdges.push({
        id: id,
        source: source,
        target: target,
        type: type,
        data: {
          relationship: relationship,
        }
      });
    });

    // xmlDoc.querySelectorAll("Repository").forEach((e) => {}); // Example
    setApplicationName(xmlDoc.querySelector("Application").getAttribute("name"));
    setNodes(loadedNodes);
    setEdges(loadedEdges);
  };

  useHotkeys('ctrl+e', () => createNode("entity"), { preventDefault: true })
  useHotkeys('ctrl+s', () => quickSave(), { preventDefault: true })
  useHotkeys('ctrl+l', () => quickLoad(), { preventDefault: true })
  useHotkeys('ctrl+c', () => CodeViewerHandler(), { preventDefault: true })
  useHotkeys('ctrl+x', () => setXmlVisibility(true), { preventDefault: true })
  useHotkeys('esc', () => { setCodeVisibility(false); setXmlVisibility(false); setExportWindowVisibility(false); })

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ position: "absolute", zIndex: 10, padding: 10 }}>
        <button onClick={quickSave}>Quick Save</button>
        <button onClick={quickLoad}>Quick Load</button>
        <button onClick={CodeViewerHandler}>View Code</button>
        <button onClick={() => setXmlVisibility(true)}>Export/Load XML</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-right"><NodeSelector onCreate={createNode} /></Panel>
        <Panel position="top-center">{ConfirmationVisibility && <Confirmation type={confirmationData.type} message={confirmationData.message} />}</Panel>
        <Panel position="bottom-center"><Application name={ApplicationName} setName={setApplicationName} /></Panel>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {XmlVisibility && <XMLView xmlContent={exportXML()} onClose={() => setXmlVisibility(false)} onLoad={handleLoadedXml} />}
      {CodeVisibility && <CodeViewer generatedCode={CodeViewerHandler()} onExport={() => exportCode()} onClose={() => setCodeVisibility(false)} />}
      {ExportWindowVisibility && <ExportWindow onClose={() => setExportWindowVisibility(false)} xml={CodeViewerHandler(false)} />}
    </div>
  );
}
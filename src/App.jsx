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
import PomCodeGenerator from "./assets/CodeGenerator/PomCodeGenerator";
import ActionButtons from "./assets/Panels/ActionButtons";
import Info from "./assets/Popups/Info";
import History from "./assets/Popups/History";
import ThymeleafCodeGenerator from "./assets/CodeGenerator/ThymeleafCodeGenerator";
import Validation from "./assets/Helpers/Validation";
import PropertiesCodeGenerator from "./assets/CodeGenerator/PropertiesCodeGenerator";
import Tours from "./assets/Helpers/Tours";

const nodeTypes = { entity: Entity };
const edgeTypes = { crowsFoot: CrowsFoot };

const initialNodes = [
  {
    id: "1",
    type: "entity",
    position: { x: 100, y: 70 },
    data: {
      label: "Consumer",
      fields: [
        { name: "id", type: "Integer", pk: true },
        { name: "name", type: "String", pk: false },
      ]
    }
  },
  {
    id: "2",
    type: "entity",
    position: { x: 360, y: 270 },
    data: {
      label: "Item",
      fields: [
        // setOrderId caused a bug in the output's controller.
        { name: "id", type: "Integer", pk: true },
        { name: "price", type: "Double", pk: false },
      ],
    }
  }
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "crowsFoot", data: { relationship: "1-m" } }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [XmlVisibility, setXmlVisibility] = useState(false);
  const [InfoVisibility, setInfoVisibility] = useState(false);
  const [ConfirmationVisibility, setConfirmationVisibility] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ type: "", message: "" });
  const [CodeVisibility, setCodeVisibility] = useState(false);
  const [entityId, setEntityId] = useState(3);
  const [ExportWindowVisibility, setExportWindowVisibility] = useState(false);
  const [ApplicationName, setApplicationName] = useState('demo');
  const [HistoryVisibility, setHistoryVisibility] = useState(false);

  const createNode = (nodeType) => {
    let newNode;

    if (nodeType === "Entity") {
      newNode = EntityGenerator(entityId.toString());
      setEntityId(entityId + 1);

    } else { // fallback
      confirmationHelper(`error`, `the node ${nodeType} does not exist`);
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

  const save = () => {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    const exportedXML = exportXML();
    if (!exportedXML) return;

    history.unshift({
      appName: ApplicationName.charAt(0).toUpperCase() + ApplicationName.slice(1),
      xml: exportedXML,
      date: new Intl.DateTimeFormat('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(new Date()),
    });

    localStorage.setItem("history", JSON.stringify(history));
    confirmationHelper('confirmation', 'The diagram has been saved to your browser!');
  };

  const CodeViewerHandler = (flag = true) => {
    if (nodes.length === 0) {
      confirmationHelper('error', 'No Nodes to generate Code from.');
      return;
    }

    const exportedXML = exportXML();
    if (exportedXML === undefined) return;
    const generatedCode = {
      Application: ApplicationCodeGenerator(exportedXML),
      Entities: EntityCodeGenerator(exportedXML),
      Controllers: ControllerCodeGenerator(exportedXML),
      Repositories: RepositoryCodeGenerator(exportedXML),
      Services: ServiceCodeGenerator(exportedXML),
      Test: TestCodeGenerator(exportedXML),
      Pom: PomCodeGenerator(exportedXML),
      Views: ThymeleafCodeGenerator(exportedXML),
      Properties: PropertiesCodeGenerator(exportedXML),
    };

    setCodeVisibility(flag);
    return generatedCode;
  };

  const exportXML = () => {
    const validate = Validation(ApplicationName, nodes);
    if (validate) {
      confirmationHelper(validate[0], validate[1], validate[2]);
      closeAllPopups();
      return;
    }

    let xml = `<Application name="${ApplicationName.charAt(0).toUpperCase() + ApplicationName.slice(1)}">\n`;
    nodes.forEach((n) => {
      if (n.type === 'entity') {
        xml += `  <Entity id="${n.id}" name="${n.data.label.charAt(0).toUpperCase() + n.data.label.slice(1)}" x="${n.position.x}" y="${n.position.y}">\n`;

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
          type: f.getAttribute("type"),
          pk: f.getAttribute("pk") === 'true' ? true : false,
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
    setNodes(() => []);
    setEdges(() => []);
    setTimeout(() => {
      setNodes(loadedNodes);
      setEdges(loadedEdges);
    }, 0);
  };

  const closeAllPopups = () => {
    setExportWindowVisibility(false);
    setHistoryVisibility(false);
    setCodeVisibility(false);
    setInfoVisibility(false);
    setXmlVisibility(false);
  }

  useHotkeys('ctrl+e', () => createNode("Entity"), { preventDefault: true });
  useHotkeys('ctrl+s', () => save(), { preventDefault: true });
  useHotkeys('ctrl+c', () => CodeViewerHandler(), { preventDefault: true });
  useHotkeys('ctrl+x', () => setXmlVisibility(true), { preventDefault: true });
  useHotkeys('esc', () => closeAllPopups());

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        proOptions={{ hideAttribution: true }}
      >
        <Panel position="top-left"><ActionButtons onSave={save} onHistory={() => setHistoryVisibility(true)} onCodeView={CodeViewerHandler} onXmlView={() => setXmlVisibility(true)} onInfo={() => setInfoVisibility(true)} /></Panel>
        <Panel position="top-right"><NodeSelector onCreate={createNode} /></Panel>
        <Panel position="top-center">{ConfirmationVisibility && <Confirmation type={confirmationData.type} message={confirmationData.message} />}</Panel>
        <Panel position="bottom-center"><Application name={ApplicationName} setName={setApplicationName} /></Panel>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <Tours />

      {InfoVisibility && <Info onClose={() => setInfoVisibility(false)} />}
      {XmlVisibility && <XMLView xmlContent={exportXML()} onClose={() => setXmlVisibility(false)} onLoad={handleLoadedXml} />}
      {CodeVisibility && <CodeViewer generatedCode={CodeViewerHandler()} onExport={() => exportCode()} onClose={() => setCodeVisibility(false)} />}
      {ExportWindowVisibility && <ExportWindow onClose={() => setExportWindowVisibility(false)} generatedCode={CodeViewerHandler(false)} onConfirmation={confirmationHelper} />}
      {HistoryVisibility && <History onClose={() => setHistoryVisibility(false)} onLoad={handleLoadedXml} />}
    </div>
  );
}
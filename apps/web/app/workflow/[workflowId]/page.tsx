"use client";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Controls,
  Background,
  MiniMap,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AddNode from "@/components/AddNode";
import FirstNodeModal from "@/components/FirstNodeModal";
import Sidebar from "@/components/Sidebar";
import ManualTrigger from "@/components/ManualTrigger";
import Modal from "@/components/Modal";
import LLM from "@/components/LLM";
import { useParams } from "next/navigation";
import Config from "@/components/Config";
import axios from "axios";

const nodeTypes = {
  addNode: AddNode,
  MANUAL: ManualTrigger,
  LLM: LLM,
};

export default function App() {
  const { workflowId } = useParams();

  interface Nodes {
    id: string;
    nodeId: string;
    type: string;
    xCoordinate: number;
    yCoordinate: number;
    data: JSON;
    config?: string;
  }

  const fetchWorflowData = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/api/workflows/" + workflowId
    );

    const nodesExist: Nodes[] = data.nodes;

    if (nodesExist && nodesExist.length > 0) {
      const nodes = nodesExist.map((node) => {
        const data = node.data;
        return {
          id: String(node.nodeId),
          position: {
            x: node.xCoordinate,
            y: node.yCoordinate,
          },
          data: {
            ...data,
            setAddNewNodeModal,
          },
          type: node.type,
        };
      });

      setNodes(nodes);
    }
    if (!data.data.nodes || data.data.nodes.length === 0) {
      setNodes([
        {
          id: "h2",
          position: { x: 100, y: 0 },
          data: { setFirseNodeModal },
          type: "addNode",
        },
      ]);
    }

    console.log(JSON.stringify(data) + "----------");
  };

  useEffect(() => {
    fetchWorflowData();
  }, []);

  const [nodes, setNodes] = useState<any[]>([]);
  const [firstNodemodal, setFirseNodeModal] = useState(false);
  const [addNewNodemodal, setAddNewNodeModal] = useState(false);
  const [edges, setEdges] = useState<any[]>([]);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          hasChild: edges.some((e) => e.source === n.id),
        },
      }))
    );
  }, [edges]);

  const handleNewNode = (data: any) => {
    const { node } = data;
    setShowConfig(true);

    setNodes((prev: any[]) => {
      const lastNode = prev[prev.length - 1];
      const newX = lastNode ? lastNode.position.x + 200 : 0;
      const newY = lastNode ? lastNode.position.y : 0;

      const newNode = {
        id: `n${prev.length + 1}`,
        position: { x: newX, y: newY },
        data: {
          label: `Node${prev.length + 1}`,
          hasChild: false,
          setAddNewNodeModal,
        },
        type: node,
      };
      axios.post("http://localhost:3000/api/node", {
        nodeId: newNode.id,
        xCoordinate: newX,
        yCoordinate: newY,
        type: data.id.toUpperCase(),
        workflowId,
        data: {
          hasChild: false,
        },
      });

      if (lastNode) {
        lastNode.data = { ...lastNode.data, hasChild: true };
        axios.put("http://localhost:3000/api/node", {
          nodeId: lastNode.id,
          data: {
            hasChild: true,
          },
        });
      }

      return [...prev.slice(0, -1), lastNode, newNode];
    });

    setEdges((prev: any[]) => [
      ...prev,
      {
        id: `n${prev.length + 1}-n${prev.length + 2}`,
        source: `n${prev.length + 1}`,
        target: `n${prev.length + 2}`,
      },
    ]);
  };

  const handleFirstNode = async (data: {
    id: string;
    title: string;
    description: string;
    icon: string;
    node: string;
  }) => {
    const { node } = data;
    const respone = await axios.post("http://localhost:3000/api/node", {
      type: data.id.toUpperCase(),
      workflowId,
      xCoordinate: 100,
      yCoordinate: 0,
      config: JSON.stringify({
        data: {
          hasChild: false,
        },
      }),
    });

    console.log(JSON.stringify(respone.data) + "-------->>>");
    setNodes([
      {
        id: `n1`,
        position: { x: 100, y: 0 },
        data: { setAddNewNodeModal },
        type: node ?? "input",
      },
    ]);
  };

  const handleDeleteEdges = (deletedEdges: any[]) => {
    setNodes((prev) =>
      prev.map((prevnode) => {
        const lastSource = deletedEdges.some((e) => e.source == prevnode.id);
        if (lastSource) {
          return {
            ...prevnode,
            data: { ...prevnode.data, hasChild: false },
          };
        }
        return prevnode;
      })
    );
  };
  const handleDeleteNodes = (deletedNodes: any[]) => {
    setNodes((prev) => {
      const remaining = prev.filter(
        (nodes) => !deletedNodes.some((d) => d.id == nodes.id)
      );
      if (remaining.length == 0) {
        return [
          {
            id: "h2",
            position: { x: 100, y: 0 },
            data: { setFirseNodeModal },
            type: "addNode",
          },
        ];
      }
      return remaining;
    });
  };

  const onNodesChange = useCallback(
    (changes: NodeChange<any>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback((changes: EdgeChange<any>[]) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
  }, []);

  const onConnect = useCallback((params: any) => {
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
  }, []);

  const handleSave = () => {
    console.log("Saving workflow:", {
      workflowId,
      nodes,
      edges,
    });
    alert("Workflow saved!");
  };

  return (
    <div className="w-screen h-screen flex">
      <Sidebar />

      <div className="h-full w-4/5 flex flex-col">
        {/* 🔹 Top Bar */}
        <div className="w-full flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            Workflow ID: {workflowId}
          </span>
          <button
            onClick={handleSave}
            className="
        px-3 py-1.5 text-sm font-medium
        rounded-md border border-gray-300
        bg-white shadow-sm
        hover:bg-blue-50 hover:border-blue-400 hover:shadow-md
        text-blue-600
        transition-all
      "
          >
            Save
          </button>
        </div>

        {/* 🔹 ReactFlow Editor (middle) */}
        <div
          style={{ flex: 1, width: "100%", height: "100%", overflow: "hidden" }}
          className="relative"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onEdgesDelete={handleDeleteEdges}
            onNodesDelete={handleDeleteNodes}
            panOnScroll
            selectionOnDrag
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* 🔹 Bottom Console Section */}
        <div
          style={{ height: "20%", width: "100%" }}
          className="border-t border-gray-200 bg-gray-50 flex flex-col"
        >
          {/* Logs area */}
          <div className="flex-1 overflow-y-auto p-2 text-xs font-mono text-gray-700">
            <div className="mb-1">[INFO] Workflow started...</div>
            <div className="mb-1">[INFO] Node executed: Manual Trigger</div>
            <div className="mb-1">[ERROR] LLM node failed: Invalid input</div>
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 flex items-center px-2 py-1 bg-white">
            <input
              type="text"
              placeholder="Enter command or input..."
              className="flex-1 text-sm px-2 py-1 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
            <button className="ml-2 px-3 py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all">
              Run
            </button>
          </div>
        </div>
      </div>

      {firstNodemodal && (
        <FirstNodeModal
          handleFirstNode={handleFirstNode}
          onClose={() => setFirseNodeModal(false)}
        />
      )}

      {addNewNodemodal && (
        <Modal
          handleNewNode={handleNewNode}
          onClose={() => setAddNewNodeModal(false)}
        />
      )}

      {showConfig && (
        <Config
          setShowConfig={setShowConfig}
          workflowId={workflowId as string}
        />
      )}
    </div>
  );
}

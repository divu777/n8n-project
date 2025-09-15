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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TextUpdaterNode } from "../components/TextUpdaterNode";
import CustomNode from "@/components/CustomNode";
import AddNode from "@/components/AddNode";

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  customNode: CustomNode,
  addNodes: AddNode,
};

export default function App() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([
    { id: "n1-n2", source: "n1", target: "n2", label: "connects 2", type: "step" },
  ]);

  // ✅ Initialize nodes *after* setNodes exists
  useEffect(() => {
  setNodes([
    {
      id: "h2",
      position: { x: 100, y: 0 },
      data: { setNodes },
      type: "addNodes",
    },

  ]);
}, []);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
                nodeTypes={nodeTypes}

        panOnScroll
        selectionOnDrag
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

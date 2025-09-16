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
import Modal from "@/components/Modal";
import Sidebar from "@/components/Sidebar";

const nodeTypes = {
  addNodes: AddNode,
};

export default function App() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [edges, setEdges] = useState<any[]>([
    {
      id: "n1-n2",
      source: "n1",
      target: "n2",
      label: "connects 2",
      type: "step",
    },
  ]);

  // ✅ Initialize nodes *after* setNodes exists
  useEffect(() => {
    setNodes([
      {
        id: "h2",
        position: { x: 100, y: 0 },
        data: { setModal },
        type: "addNodes",
      },
    ]);
  }, []);

    const handleNewNode = () => {
    setNodes((prev: any[]) => [
      ...prev,
      {
        id: `n${prev.length + 1}`,
        position: { x: 50, y: 50 * prev.length },
        data: { label: `Node ${prev.length + 1}` },
        type: "input",
      },
    ]);
  };

  const onNodesChange = useCallback(
    (changes: NodeChange<any>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<any>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="w-screen h-screen flex">
      <Sidebar/>
      <div className="h-screen w-3/4">
        <div style={{ width: "100%", height: "100%" }}>
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
      </div>
      {modal && (
        <Modal addNode={ handleNewNode} onClose={()=>setModal(false)}/>
      )}
    </div>
  );
}

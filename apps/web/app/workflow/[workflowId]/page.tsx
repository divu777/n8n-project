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

const nodeTypes = {
  addNodes: AddNode,
  manualTrigger: ManualTrigger,
  llm:LLM
};

export default function App() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [firstNodemodal, setFirseNodeModal] = useState(false);
  const [addNewNodemodal, setAddNewNodeModal] = useState(false);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    if (nodes.length == 0) {
      setNodes([
        {
          id: "h2",
          position: { x: 100, y: 0 },
          data: { setFirseNodeModal },
          type: "addNodes",
        },
      ]);
    }
  }, []);

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

  setNodes((prev: any[]) => {
    const lastNode = prev[prev.length - 1];
    const newX = lastNode ? lastNode.position.x + 200 : 0;
    const newY = lastNode ? lastNode.position.y : 0;

    const newNode = {
      id: `n${prev.length + 1}`,
      position: { x: newX, y: newY },
      data: { label: `Node${prev.length + 1}`, hasChild: false,setAddNewNodeModal },
      type: node,
    };

    if (lastNode) {
      lastNode.data = { ...lastNode.data, hasChild: true };
    }

    return [...prev.slice(0, -1), lastNode, newNode];
  });

  setEdges((prev: any[]) => [
    ...prev,
    {
      id: `n${prev.length + 1}-n${prev.length+2}`,
      source: `n${prev.length+1}`,
      target: `n${prev.length + 2}`,
    },
  ]);
};

  const handleFirstNode = (data: any) => {
    const { node } = data;
    setNodes([
      {
        id: `n1`,
        position: { x: 100, y: 0 },
        data: { setAddNewNodeModal },
        type: node ?? "input",
      },
    ]);
  };

  const handleDeleteEdges = (deletedEdges:any[]) =>{
    setNodes((prev)=>
    prev.map((prevnode)=>{
      const lastSource = deletedEdges.some((e)=>e.source == prevnode.id)
      if(lastSource){
        return{
          ...prevnode,data:{...prevnode.data,hasChild:false}
        }
      }
      return prevnode;
    }))
  }

  const onNodesChange = useCallback(
    (changes: NodeChange<any>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<any>[]) =>{
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
    },
    []
  );

  const onConnect = useCallback(
    (params: any) =>{
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))
    },
    []
  );

  return (
    <div className="w-screen h-screen flex">
      <Sidebar />
      <div className="h-screen w-3/4">
        <div style={{ width: "100%", height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onEdgesDelete={handleDeleteEdges}
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
    </div>
  );
}

"use client";
import { useState, useCallback, useEffect, Key } from "react";
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
import Agent from "@/components/Agent";

 const nodeTypes = {
  addNode: AddNode,
  MANUAL: ManualTrigger,
  LLM: LLM,
  AGENT:Agent
};

export default function App() {
  const { workflowId } = useParams();
  const [workflowResult, setWorkflowResult] = useState<Record<string,any>>(
    {}
  );
  interface Nodes {
    id: string;
    nodeId: string;
    type: string;
    xCoordinate: number;
    yCoordinate: number;
    data: JSON;
    config?: string;
  }

  type nodesType = {
    id: string;
    type: string;
    data: {
      hasChild: boolean;
    };
  };

  const fetchWorflowData = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/api/workflows/" + workflowId
    );
    //console.log(JSON.stringify(data)+"------nodeexit")

    const nodesExist = data.data.nodes ?? [];
    //console.log(JSON.stringify(nodesExist)+"------nodeexit222")

    if (nodesExist && nodesExist.length > 0) {
      const nodes = nodesExist.map(
        (node: {
          data: any;
          nodeId: any;
          xCoordinate: any;
          yCoordinate: any;
          type: any;
        }) => {
          //  console.log(JSON.stringify(node)+"------node")
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
              handleExecute : node.type=='MANUAL' ? handleExecute : undefined
            },
            type: node.type,
          };
        }
      );

      setNodes(nodes);
    }
    if (!nodesExist || nodesExist.length === 0) {
      setNodes([
        {
          id: "h2",
          position: { x: 100, y: 0 },
          data: { setFirseNodeModal },
          type: "addNode",
        },
      ]);
    }

    const edgesExist = data.data.edges
    //console.log("edgg========"+JSON.stringify(edgesExist))
    if(edgesExist && edgesExist.length >0){
      const edges = edgesExist.map((edge: { id: string; sourceId: string; targetId: string; })=>{
        return{
          id:edge.id,
          source:edge.sourceId,
          target:edge.targetId
        }
      })

      //console.log(edges)

      setEdges(edges)
    }

    if(!edgesExist || edgesExist.length===0){
      console.log("here")
      setEdges([])
    }
    //  console.log(JSON.stringify(data) + "---------g-");
  };

  // const handleExecute = async()=>{
  //   const {data}= await axios.get(`http://localhost:3000/api/workflows/${workflowId}/execute`)
  //   console.log(JSON.stringify(data)+"-------execution response");
  //         setWorkflowResult(data.result);

  // }

  const [lastExecutedNode, setLastExecutedNode] = useState<string | null>(null);

  const handleExecute = async () => {
  setWorkflowResult({});
  const res = await fetch(`/api/workflows/${workflowId}/execute`);
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const results: Record<string, any> = {};

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n');
    buffer = parts.pop()!;

    for (const part of parts) {
      if (!part.trim()) continue;
      const data = JSON.parse(part);

      if (data.event === 'node-result') {
        // results[data.nodeId] = data.result;
        // setWorkflowResult({ ...results });
        setWorkflowResult(prev => {
          const existingLogs = prev[data.nodeId] || [];
          return {
            ...prev,
            [data.nodeId]: [...existingLogs, data.result],
          };
        });
        setLastExecutedNode(data.nodeId);
      }
    }
  }
};



  useEffect(() => {
    fetchWorflowData();

  }, []);

  const [nodes, setNodes] = useState<any[]>([]);
  const [firstNodemodal, setFirseNodeModal] = useState(false);
  const [addNewNodemodal, setAddNewNodeModal] = useState(false);
  const [edges, setEdges] = useState<any[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedNodeID, setSelectedNodeId] = useState<string | null>(null);

  const handlSaveNodeConfig = async (data?: any) => {
    let newNodeId = `n${nodes.length + 1}`;
    const config = data ? data : null;
    const selectedNode = nodes.find((n) => n.selected === true);

    const lastNode = selectedNode || nodes[nodes.length - 1];
    const newX = lastNode ? lastNode.position.x + 200 : 0;
    const newY = lastNode ? lastNode.position.y : 0;

    const newNode = {
      id: newNodeId,
      position: { x: newX, y: newY },
      data: {
        label: `Node${nodes.length + 1}`,
        hasChild: false,
        setAddNewNodeModal,
      },
      type: selectedNodeID,
    };
    setNodes((prev) => {
      const updatedNodes = prev.map((n) =>
        n.id === lastNode?.id
          ? { ...n, data: { ...n.data, hasChild: true } }
          : n
      );
      return [...updatedNodes, newNode];
    });

    setEdges((prev: any[]) => [
      ...prev,
      {
        id: `${selectedNode?.id || `n${nodes.length}`}-${newNodeId}`,
        source: selectedNode?.id || `n${nodes.length}`,
        target: newNodeId,
      },
    ]);

    setShowConfig(false);

    try {
      const response = await axios.post("http://localhost:3000/api/node", {
        nodeId: newNode.id,
        xCoordinate: newX,
        yCoordinate: newY,
        type: selectedNodeID,
        workflowId,
        data: {
          hasChild: false,
        },
        config,
      });

      const response2 = await axios.post("http://localhost:3000/api/edges", {
        sourceId: selectedNode.id,
        targetId: newNode.id,
        workflowId,
      });

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error saving node:", error);
    }
  };

//   useEffect(()=>{
//   console.log(JSON.stringify(edges)+"-------edg"),
//     console.log(JSON.stringify(nodes)+"-------nodeee")

// },[edges,nodes])

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

  const handleNewNode = (data: { id: any }) => {
    setShowConfig(true);
    setSelectedNodeId(data.id);
  };

  const handleFirstNode = async (data: {
    id: string;
    title: string;
    description: string;
    icon: string;
    node: string;
  }) => {
    const respone = await axios.post("http://localhost:3000/api/node", {
      type: data.id,
      workflowId,
      nodeId: "n1",
      xCoordinate: 100,
      yCoordinate: 0,
      data: {
        hasChild: false,
      },
      isTrigger:true
    });


 //   console.log(JSON.stringify(respone.data) + "-------->>>");
    setNodes([
      {
        id: `n1`,
        position: { x: 100, y: 0 },
        data: { setAddNewNodeModal,handleExecute, hasChild:false },
        type: data.id ?? "input",
      },
    ]);
  };

  const handleDeleteEdges = async(deletedEdges: any[]) => {

    const {data} = await axios.delete('http://localhost:3000/api/edges',{
      data:{
        edges:deletedEdges
      }
    })
   // console.log(JSON.stringify(data)+"---deleted edge db")
 //   console.log(JSON.stringify(deletedEdges) + "-------->deleted edges");
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
  const handleDeleteNodes =async (deletedNodes: any[]) => {
    //console.log(JSON.stringify(deletedNodes)+"---------deleted nodes")
     const {data} = await axios.delete('http://localhost:3000/api/node',{
      data:{
        nodes:deletedNodes,
        workflowId
      }
    })
        //console.log(JSON.stringify(data)+"---deleted edge db")

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

  const onNodesChange = useCallback((changes: NodeChange<any>[]) => {
    //     console.log(JSON.stringify(changes)+"------nodes changes ")

    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<any>[]) => {
    // console.log(JSON.stringify(changes)+"------edges changes ")
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
  }, []);

  const onConnect = useCallback(async(params: any) => {
    //console.log(JSON.stringify(params)+"0------connect")
    const {data} = await axios.post('http://localhost:3000/api/edges',{
      workflowId,
      sourceId:params.source,
      targetId:params.target
    })

    //console.log(JSON.stringify(data)+"------connnext log ")
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

        {/* 🔹 Bottom Console Section (Streaming Logs) */}
<div
  style={{ height: "25%", width: "100%" }}
  className="border-t border-gray-200 bg-gray-50 flex"
>
  {/* Left column — Node list */}
  <div className="w-1/3 border-r border-gray-300 overflow-y-auto p-2">
    <h2 className="text-xs font-semibold text-gray-600 mb-2">
      Nodes in Workflow
    </h2>
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li
          key={n.id}
          onClick={() => setSelectedNodeId(n.id)}
          className={`px-2 py-1 rounded-md text-xs cursor-pointer ${
            selectedNodeID === n.id
              ? "bg-blue-100 text-blue-700 font-medium"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          {n.type}
        </li>
      ))}
    </ul>
  </div>

  {/* Right column — Streaming results */}
  <div className="w-2/3 flex flex-col">
    <div className="flex-1 overflow-y-auto p-2 text-xs font-mono text-gray-700 bg-white">
      <h2 className="text-xs font-semibold text-gray-600 mb-2">
        Execution Logs
      </h2>
      {workflowResult ? (
        Object.entries(workflowResult).map(([nodeId, logs]: any) => (
          <div
            key={nodeId}
            className={`mb-2 p-1 rounded ${
      lastExecutedNode === nodeId ? 'bg-green-100 animate-pulse' : ''
    }`}
          >
            <div className="font-semibold text-gray-800">
              ▶ Node: {nodeId}
            </div>
            {logs.map((result: any, idx: Key | null | undefined) => (
      <pre
        key={idx}
        className="bg-gray-50 p-2 rounded text-gray-600 whitespace-pre-wrap"
      >
        {JSON.stringify(result, null, 2)}
      </pre>
    ))}
          </div>
        ))
      ) : (
        <div className="text-gray-400 italic">No results yet...</div>
      )}
    </div>

    {/* Execute Button */}
    <div className="border-t border-gray-200 flex items-center px-2 py-1 bg-white">
      <button
        onClick={handleExecute}
        className="ml-auto px-3 py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all"
      >
        Run Workflow
      </button>
    </div>
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
          handleSaveConfig={handlSaveNodeConfig}
          setShowConfig={setShowConfig}
          workflowId={workflowId as string}
        />
      )}
    </div>
  );
}

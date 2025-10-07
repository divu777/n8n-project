"use client";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

interface WorkflowInterface {
  id:string,
  name:string,
  status:"ACTIVE"|"INACTIVE"
}

const Home = ({ workflowsData }: { workflowsData: WorkflowInterface[] }) => {

  const [workflows, setWorkflows] = useState(workflowsData ?? []);
  const [modal,setModal] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null) 
  const router = useRouter();
  const session = useSession()
console.log(JSON.stringify(session)+"=======")

if(!session || !session.data){
  return
}


  const handleCreateWorkflow = async()=>{
    console.log(nameRef.current?.value)

    if(nameRef.current?.value){
      console.log("bere")
      
      const {data} = await axios.post("http://localhost:3000/api/workflows",{
          userId:session.data.user.id,
          name:nameRef.current.value 
        })
        if(data.success){
            setWorkflows((prev)=>[...prev,data.data])
          }
          console.log(JSON.stringify(data))
        }
                    setModal(false)

  }
  return (
    <div className="flex h-screen w-screen bg-white text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex h-screen w-3/4 flex-col p-8 space-y-6 overflow-y-auto">
        {/* Overview header */}
        <div className="flex w-full items-center justify-between border-b pb-4">
  <div>
    <h1 className="text-2xl font-semibold mb-1">Overview</h1>
    <p className="text-sm text-gray-500">
      All the workflows you have access to
    </p>
  </div>

  <button
    onClick={() => setModal(true)}
    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
  >
    + Create Workflow
  </button>
</div>

        {/* Stats section */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-xs text-gray-500">Prod. executions</p>
            <h2 className="text-xl font-bold">0</h2>
            <p className="text-xs text-gray-400">Last 7 days</p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-xs text-gray-500">Failed prod. executions</p>
            <h2 className="text-xl font-bold">0</h2>
            <p className="text-xs text-gray-400">Last 7 days</p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-xs text-gray-500">Failure rate</p>
            <h2 className="text-xl font-bold">0%</h2>
            <p className="text-xs text-gray-400">Last 7 days</p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-xs text-gray-500">Time saved</p>
            <h2 className="text-xl font-bold">--</h2>
            <p className="text-xs text-gray-400">Last 7 days</p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-xs text-gray-500">Run time (avg.)</p>
            <h2 className="text-xl font-bold">0s</h2>
            <p className="text-xs text-gray-400">Last 7 days</p>
          </div>
        </div>

        {/* Workflows list */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-gray-200 pb-2">
            Workflows
          </h2>
          {workflows && workflows.length > 0 ? (
            <div className="space-y-3">
              {workflows.map((workflow, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border rounded-lg p-4 flex justify-between items-center"
                  onClick={() => {
                    router.push("/workflow/" + workflow.id);
                  }}
                >
                  <div>
                    <h3 className="font-medium">{workflow.name}</h3>
                    <p className="text-xs text-gray-500">
                      Last updated X days ago | Created on [date]
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border p-6 rounded-lg text-center text-gray-400">
              No workflows found
            </div>
          )}
        </div>
      </div>
          {modal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold">Create Workflow</h2>
            <p className="text-sm text-gray-500">
              Give your workflow a name to get started.
            </p>

            <input
              ref={nameRef}
              type="text"
              defaultValue={`New Workflow ${workflows.length + 1}`}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

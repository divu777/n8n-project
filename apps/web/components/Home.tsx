"use client";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Workflow } from "lucide-react";
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
//console.log(JSON.stringify(session)+"=======")

if(!session || !session.data){
  return
}


  const handleCreateWorkflow = async()=>{
   // console.log(nameRef.current?.value)

    if(nameRef.current?.value){
      //console.log("bere")
      
      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/workflows`,{
          userId:session.data.user.id,
          name:nameRef.current.value 
        })

        if(data.success){
            setWorkflows((prev)=>[...prev,data.data])

          }
          //console.log(JSON.stringify(data))
        }
                    setModal(false)

  }
  return (
     <div className="flex h-screen w-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex h-screen w-3/4 flex-col p-10 space-y-8 overflow-y-auto">
        {/* Overview header */}
        <div className="flex w-full items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Overview</h1>
            <p className="text-sm text-gray-500 mt-1">
              All the workflows you have access to
            </p>
          </div>

          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#ff4b2b] to-[#ff6200] text-white font-medium shadow-md hover:opacity-90 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Create Workflow
          </button>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-5 gap-5">
          {[
            ["Prod. executions", "0", "Last 7 days"],
            ["Failed executions", "0", "Last 7 days"],
            ["Failure rate", "0%", "Last 7 days"],
            ["Time saved", "--", "Last 7 days"],
            ["Run time (avg.)", "0s", "Last 7 days"],
          ].map(([label, value, note], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-xs text-gray-500">{label}</p>
              <h2 className="text-2xl font-light mt-1">{value}</h2>
              <p className="text-xs text-gray-400">{note}</p>
            </motion.div>
          ))}
        </div>

        {/* Workflows list */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b border-gray-200 pb-2">
            Workflows
          </h2>

          {workflows && workflows.length > 0 ? (
            <div className="space-y-4">
              {workflows.map((workflow, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => router.push("/workflow/" + workflow.id)}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 flex justify-between items-center cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Workflow className="w-5 h-5 text-red-500" />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Last updated X days ago • Created on [date]
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      workflow.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {workflow.status}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border p-6 rounded-lg text-center text-gray-400"
            >
              No workflows found
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-5 border border-gray-100"
            >
              <h2 className="text-2xl font-light text-gray-900">
                Create Workflow
              </h2>
              <p className="text-sm text-gray-500">
                Give your workflow a name to get started.
              </p>

              <input
                ref={nameRef}
                type="text"
                defaultValue={`New Workflow ${workflows.length + 1}`}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#ff4b2b] focus:outline-none transition"
              />

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setModal(false)}
                  className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkflow}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#ff4b2b] to-[#ff6200] text-white font-medium shadow hover:opacity-90 transition-all"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

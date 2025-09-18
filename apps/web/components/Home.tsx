"use client";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Home = ({ workflowsData }: { workflowsData: string[] }) => {
  const [workflows, setWorkflows] = useState(workflowsData);
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen bg-white text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex h-screen w-3/4 flex-col p-8 space-y-6 overflow-y-auto">
        {/* Overview header */}
        <div>
          <h1 className="text-2xl font-semibold mb-1">Overview</h1>
          <p className="text-sm text-gray-500">
            All the workflows you have access to
          </p>
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
                    router.push("/workflow/" + workflow);
                  }}
                >
                  <div>
                    <h3 className="font-medium">{workflow}</h3>
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
    </div>
  );
};

export default Home;

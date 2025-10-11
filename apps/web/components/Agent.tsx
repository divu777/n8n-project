"use client";
import { Handle, Position } from "@xyflow/react";
import { Plus, Bot } from "lucide-react";
import React from "react";

const Agent = ({ data }: { data: any }) => {
  const { setAddNewNodeModal, hasChild } = data;

  return (
    <div className="relative flex items-center">
      {/* Target handle (incoming edge) */}
      <Handle type="target" position={Position.Left} className="!bg-blue-400" />

      {/* Node box */}
      <div
        className="
          flex items-center gap-2
          px-3 py-2
          rounded-md border border-gray-300
          bg-white shadow-sm
          hover:shadow-md hover:border-blue-400
          transition-all select-none
        "
      >
        <Bot className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-medium text-gray-700">Agent</span>
      </div>

      {/* Connector + Plus button (only if no child) */}
      {!hasChild && (
        <div className="relative flex items-center">
          <div className="w-2 h-px bg-gray-300" />
          <div
            className="
              flex items-center justify-center
              w-3 h-3
              rounded-full border border-gray-300
              bg-white shadow-sm
              hover:bg-blue-50 hover:border-blue-400 hover:shadow-md
              transition-all cursor-pointer
              select-none
            "
            onClick={() => setAddNewNodeModal(true)}
          >
            <Plus className="w-2 h-2 text-blue-500" />
          </div>
        </div>
      )}

      {/* Source handle (outgoing edge) */}
      <Handle type="source" position={Position.Right} className="!bg-blue-400" />

      
    </div>
  );
};

export default Agent;

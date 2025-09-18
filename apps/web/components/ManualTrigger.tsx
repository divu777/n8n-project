"use client";
import { Handle, Position } from "@xyflow/react";
import { Plus, Pointer } from "lucide-react";
import React from "react";

const ManualTrigger = ({data}:{data:any}) => {
    const {setAddNewNodeModal,hasChild} = data

  return (
    <div className="relative flex items-center">
      {/* Manual Trigger box */}
            <Handle type="source" position={Position.Right} className="!bg-red-400" />

      <div
        className="
          flex items-center gap-2
          px-3 py-2
          rounded-md border border-gray-300
          bg-white shadow-sm
          hover:shadow-md hover:border-red-400
          transition-all cursor-pointer
          select-none
        "
      >
        <Pointer className="w-4 h-4 text-red-500" />
        <span className="text-xs font-medium text-gray-700">
          Manual Trigger
        </span>
      </div>

      {/* Connector line */}
      {!hasChild && (
        <div className="relative flex items-center">
          <div className="w-2 h-px bg-gray-300" />
          <div
            className="
              flex items-center justify-center
              w-3 h-3
              rounded-full border border-gray-300
              bg-white shadow-sm
              hover:bg-red-50 hover:border-red-400 hover:shadow-md
              transition-all cursor-pointer
              select-none
            "
            onClick={() => setAddNewNodeModal(true)}
          >
            <Plus className="w-2 h-2 text-red-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualTrigger;

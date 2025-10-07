"use client";
import { Handle, Position } from "@xyflow/react";
import { Play, Plus, Pointer } from "lucide-react";
import React, { useState } from "react";

const ManualTrigger = ({ data }: { data: any }) => {
  const { setAddNewNodeModal, hasChild } = data;
    const [showMenu, setShowMenu] = useState(false);
    let hideTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    setShowMenu(true);
  };

   const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => setShowMenu(false), 200); // add small delay
  };

  return (
    <div className="relative flex items-center"
       onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

       {showMenu && (
           <div
          className="
            absolute left-0 top-full mt-1 w-20
            rounded-md border border-gray-300
            bg-red-500 shadow-sm
            flex items-center gap-1
            px-2 py-1
            text-white
            cursor-pointer
            hover:bg-red-600 hover:border-white
            transition-all
            z-50
          "
          onClick={() => console.log("hee")}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Play className="w-3 h-3" />
          <span className="text-xs font-light">Execute</span>
        </div>
      )}

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

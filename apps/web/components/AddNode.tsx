"use client";
import { Plus } from "lucide-react";
import React from "react";

const AddNode = ({ data }: { data: { setFirseNodeModal: (fn: (prev: boolean) => boolean) => void } }) => {
  const { setFirseNodeModal } = data;

  return (
    <div
      onClick={() => setFirseNodeModal((prev) => !prev)}
      className="
        flex items-center justify-center
        w-8 h-8
        rounded-full border border-gray-300
        bg-white shadow-sm
        hover:bg-red-50 hover:border-red-400 hover:shadow-md
        transition-all cursor-pointer
        select-none
      "
    >
      <Plus className="w-4 h-4 text-red-500" />
    </div>
  );
};

export default AddNode;

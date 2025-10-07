import React, { useState } from "react";
import { Search, X } from "lucide-react";

const FirstNodeModal = ({
  handleFirstNode,
  onClose
}: {
  handleFirstNode: (data:any) => any;
  onClose: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const triggers = [
    {
      id: "manual",
      title: "Trigger manually",
      description:
        "Runs the flow on clicking a button in n8n. Good for getting started quickly",
      icon: "👆",
      node: "manual",
    },
    {
      id: "schedule",
      title: "On a schedule",
      description: "Runs the flow every day, hour, or custom interval",
      icon: "⏰",
      node: "manual",
    },
    {
      id: "webhook",
      title: "On webhook call",
      description: "Runs the flow on receiving an HTTP request",
      icon: "🔗",
      node: "manual",
    },
    {
      id: "form",
      title: "On form submission",
      description:
        "Generate webforms in n8n and pass their responses to the workflow",
      icon: "📝",
      node: "manual",
    },
    {
      id: "workflow",
      title: "When executed by another workflow",
      description:
        "Runs the flow when called by the Execute Workflow node from a different workflow",
      icon: "🔄",
      node: "manual",
    },
  ];

  const filteredTriggers = triggers.filter(
    (trigger) =>
      trigger.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trigger.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTriggerSelect = (trigger: any) => {
    console.log("Selected trigger:", trigger);

    handleFirstNode(trigger);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 flex flex-col border-l border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            What triggers this workflow?
          </h2>
          <p className="text-sm text-gray-500">
            A trigger is a step that starts your workflow
          </p>
        </div>

        {/* Search Container */}
        <div className="px-6 pb-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-md pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Triggers List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-0">
            {filteredTriggers.map((trigger) => (
              <div
                key={trigger.id}
                onClick={() => handleTriggerSelect(trigger)}
                className="flex items-start py-3 cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2 group"
              >
                {/* Icon */}
                <div className="w-8 h-8 flex items-center justify-center text-base mr-3 flex-shrink-0 mt-0.5">
                  {trigger.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {trigger.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {trigger.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-gray-300 group-hover:text-gray-400 ml-2 flex-shrink-0 text-sm mt-1">
                  →
                </div>
              </div>
            ))}

            {filteredTriggers.length === 0 && (
              <div className="text-gray-400 text-center py-8 text-sm">
                No triggers found
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FirstNodeModal;

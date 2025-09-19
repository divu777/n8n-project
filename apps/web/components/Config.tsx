"use client";
import axios from "axios";
import React, { useState } from "react";

const Config = ({ setShowConfig }: { setShowConfig: (x: boolean) => any }) => {
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([{ role: "user", content: "" }]);

  const apiKeys = ["Key 1", "Key 2", "Key 3", "Add new credentials..."];
  const models = ["gpt-4", "gpt-3.5", "llama-3"];

  const handleAddMessage = () => {
    setMessages([...messages, { role: "user", content: "" }]);
  };

  const handleChangeMessage = (
    index: number,
    field: "role" | "content",
    value: string
  ) => {
    const updated = [...messages];
    updated[index]![field] = value;
    setMessages(updated);
  };

  const handleSaveConfig = async()=>{
    const response = await axios.post("http://localhost:3001/api/node/")
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50  z-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl border border-gray-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Configuration</h2>
          <button 
            onClick={() => setShowConfig(false)}
            className="text-white hover:text-gray-200 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* API Key Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              API Key
            </label>
            <select
              value={selectedKey}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Add new credentials...") {
                  console.log("Add new credentials triggered");
                } else {
                  setSelectedKey(value);
                }
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white"
            >
              <option value="">Select API Key</option>
              {apiKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selection */}
          {selectedKey && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white"
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Messages Section */}
          {selectedModel && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-600">
                  Messages
                </label>
                <button
                  onClick={handleAddMessage}
                  className="text-xs px-2 py-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add
                </button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={msg.role}
                      onChange={(e) =>
                        handleChangeMessage(index, "role", e.target.value)
                      }
                      className="w-20 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white"
                    >
                      <option value="user">User</option>
                      <option value="ai">AI</option>
                      <option value="system">System</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Message..."
                      value={msg.content}
                      onChange={(e) =>
                        handleChangeMessage(index, "content", e.target.value)
                      }
                      className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2 border-t border-gray-200">
          <button
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
            onClick={() => setShowConfig(false)}
          >
            Cancel
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Config;
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddCredentials from "./AddCredentials";
import { useSession } from "next-auth/react";
import { useCredentials } from "@/lib/hooks/useCredentials";
interface Message {
  role: string;
  content: string;
}

const MODELS: Record<string, string[]> = {
  OpenAI: ["gpt-3.5-turbo", "gpt-4", "gpt-4o"],
  Anthropic: ["Claude-2", "Claude-Instant", "Claude-Next"],
  Gemini: ["Gemini Pro", "Gemini Ultra", "Gemini Light"],
};

const LLM_PROVIDERS = Object.keys(MODELS);

const Config = ({
  setShowConfig,
  workflowId,
  handleSaveConfig,
}: {
  setShowConfig: (x: boolean) => any;
  workflowId: string;
  handleSaveConfig: (x?: any) => void;
}) => {
  const session = useSession();
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [addnewCred, setaddNewCred] = useState(false);
  const { apiKeys, setApiKeys } = useCredentials(session.data?.user.id);
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "" },
  ]);

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

  const handleSaveConfiguration = async () => {
    handleSaveConfig({
      messages,
      api_key_id: selectedKey,
      model: selectedModel,
    });
  };

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
                const provider =
                  e.target.selectedOptions[0]!.getAttribute("data-provider");

                if (value === "Add new credentials...") {
                  console.log("Add new credentials triggered");
                  setaddNewCred(true);
                } else {
                  setSelectedKey(value);
                  setSelectedProvider(provider!);
                }
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white"
            >
              <option value="">Select API Key</option>
              {apiKeys.map((key) => (
                <option
                  key={key.id}
                  value={key.id}
                  data-provider={key.Provider}
                >
                  {key.Provider}
                </option>
              ))}
              <option value="Add new credentials...">
                Add new credentials...
              </option>
            </select>
          </div>

          {/* Adding New Credentials */}
          {addnewCred && (
            <AddCredentials
              setApiKeys={setApiKeys}
              llmProviders={LLM_PROVIDERS}
              setaddNewCred={setaddNewCred}
              userId={session.data!.user.id}
            />
          )}

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
                {MODELS[selectedProvider]!.map((model) => (
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
                      <option value="assistant">AI</option>
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
            onClick={() => {
              handleSaveConfig();
              setShowConfig(false);
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveConfiguration}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Config;

"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";

const AddCredentials = ({
  setApiKeys,
  llmProviders,
  setaddNewCred,
  userId,
}: {
  setApiKeys: (x: any) => any;
  llmProviders: string[];
  setaddNewCred: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}) => {
  //console.log(JSON.stringify(session.data))
  const [provider, setProvider] = useState("OpenAI");

  const apiKeyRef = useRef<HTMLInputElement>(null);
  const handleAddNewCred = async () => {
    console.log("P" + provider);
    console.log("a" + apiKeyRef.current?.value);
    if (provider && apiKeyRef.current?.value) {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/credentials/` + userId,
        {
          provider,
          api_key: apiKeyRef.current.value,
        }
      );

      setApiKeys((prev: any) => [...prev, data.data]);

    //  console.log(JSON.stringify(data) + "=============");

      setaddNewCred(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40">
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Credentials
        </h2>

        {/* Provider Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Provider</option>
            {llmProviders.map((llm) => (
              <option key={llm} value={llm}>
                {llm}
              </option>
            ))}
          </select>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            ref={apiKeyRef}
            type="text"
            placeholder="Enter your API key"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => setaddNewCred(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => handleAddNewCred()}
          >
            Savey
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCredentials;

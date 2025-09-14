import { Divide } from "lucide-react";
import React, { useState } from "react";

const AddNode = ({ data }: any) => {
  const { setNodes } = data;
  const [modal, setModal] = useState(false);

  const handleNewNode = () => {
    setNodes((prev: any[]) => [
      ...prev,
      {
        id: `n${prev.length + 1}`,
        position: { x: 50, y: 50 * prev.length },
        data: { label: `Node ${prev.length + 1}` },
        type: "input",
      },
    ]);
  };

  return (
    <>
      <div
        style={{
          cursor: "pointer",
          padding: 10,
          border: "1px solid black",
          borderRadius: 4,
          background: "#f0f0f0",
          textAlign: "center",
          width: 40,
 
        }}
        onClick={() => setModal((prev) => !prev)}
      >
        +
      </div>

      {modal && (
        <div
          style={{
            position: "fixed", // <- key change
            top: 0,
            right: 0,
            height: "100vh",
            width: "300px",
            background: "#ef4444",
            color: "white",
            zIndex: 2000, // make sure it floats above React Flow
            padding: "20px",
          }}
        >
          <h2 className="text-xl font-bold">Hello</h2>
          <button
            onClick={handleNewNode}
            style={{
              marginTop: "20px",
              background: "white",
              color: "black",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Click to add
          </button>
        </div>
      )}
    </>
  );
};

export default AddNode;

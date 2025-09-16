import { Divide } from "lucide-react";
import React, { useState } from "react";
import Modal from "./Modal";

const AddNode = ({data}:any) => {
  const {setModal } = data;




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
        onClick={() => setModal((prev:boolean) => !prev)}
      >
        +
      </div>
    </>
  );
};

export default AddNode;

'use client'
import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";

export function TextUpdaterNode(props) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className="text-updater-node">
      <div>Hello</div>
      {/* <div className="">
        <input id="text" name="text" onChange={onChange} className="drag" />
      </div> */}
      <Handle type="source" position={Position.Top} />
              <Handle type="target" position={Position.Bottom} />

    </div>
  );
}
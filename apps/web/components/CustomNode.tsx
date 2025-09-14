'use client'
import { Handle, Position } from '@xyflow/react'
import React from 'react'

const CustomNode = (props) => {
  return (
    <div>
      <Handle type='source' position={Position.Bottom}/>
        <Handle type='source' position={Position.Bottom}/>
    <h1>hello2</h1>
    </div>
  )
}

export default CustomNode

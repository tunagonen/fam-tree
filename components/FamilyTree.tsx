"use client";

import React from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import FamilyMemberNode from "./FamilyMemberNode";
import { familyTreeData, familyConnections } from "@/data/familyData";
import { createNodesAndEdges } from "@/lib/familyTreeLayout";

// Fallback node for debugging
const FallbackNode = ({ id, data }: { id: string; data?: any }) => (
  <div className="bg-yellow-200 border-2 border-yellow-600 px-4 py-2 rounded shadow text-center">
    <span className="font-bold text-yellow-800">Unknown Node: {id}</span>
    <div className="text-xs text-gray-700">{id}</div>
    {data && data.label && (
      <div className="text-xs text-gray-500">{data.label}</div>
    )}
  </div>
);

const nodeTypes: NodeTypes = {
  familyMember: (props) => <FamilyMemberNode {...props} />,
  familyUnit: () => (
    <div
      className="flex items-center justify-center"
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#ef4444",
        border: "2px solid #ef4444",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Top} />
      {/* Simple circle, no text */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  ),
  fallback: FallbackNode,
};

const FamilyTree: React.FC = () => {
  const { nodes, edges } = createNodesAndEdges(
    familyTreeData,
    familyConnections
  );
  // DEBUG LOG
  if (typeof window !== "undefined") {
    // Only log in browser
    console.log("NODES:", nodes);
    console.log("EDGES:", edges);
  }
  const [rfNodes, , onNodesChange] = useNodesState(nodes);
  const [rfEdges, , onEdgesChange] = useEdgesState(edges);

  return (
    <div className="w-full min-h-[600px] h-screen bg-gray-50">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        className="bg-gray-50"
      >
        <Background color="#e2e8f0" />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FamilyTree;

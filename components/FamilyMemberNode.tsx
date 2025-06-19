"use client";

import React, { memo } from "react";
import { NodeProps, Handle, Position } from "@xyflow/react";

export interface FamilyMemberNodeProps extends NodeProps {
  data: {
    name: string;
    gender: "male" | "female";
    isBloodline: boolean;
  };
}

const FamilyMemberNode = memo(({ data, selected }: FamilyMemberNodeProps) => {
  const { name, gender, isBloodline } = data;

  // Gender icon (♂️/♀️)
  const genderIcon =
    gender === "male" ? (
      <span className="ml-1 text-blue-200">♂️</span>
    ) : (
      <span className="ml-1 text-pink-200">♀️</span>
    );

  // Node color: orange for bloodline, blue for outsider
  const bgColor = isBloodline ? "bg-orange-500" : "bg-blue-500";

  return (
    <div
      className={`flex items-center justify-center w-40 h-12 rounded-full shadow-md text-white ${bgColor} border-2 border-white transition-all duration-300 ${
        selected ? "ring-2 ring-blue-500" : "hover:shadow-lg"
      } relative`}
    >
      {/* Handles for React Flow connections */}
      <Handle type="target" position={Position.Top} />
      <span className="font-semibold text-base flex items-center">
        {name} {genderIcon}
      </span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

FamilyMemberNode.displayName = "FamilyMemberNode";

export default FamilyMemberNode;

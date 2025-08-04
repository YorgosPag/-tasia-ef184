"use client";

import React from "react";

interface VertexHandleProps {
  vertex: { x: number; y: number };
  index: number;
  isSelected: boolean;
  onMouseDown: (index: number, event: React.MouseEvent) => void;
}

export function VertexHandle({
  vertex,
  index,
  isSelected,
  onMouseDown,
}: VertexHandleProps) {
  return (
    <circle
      cx={vertex.x}
      cy={vertex.y}
      r={isSelected ? 6 : 4}
      fill={isSelected ? "#7c3aed" : "#ffffff"}
      stroke={isSelected ? "#7c3aed" : "#4b5563"}
      strokeWidth={2}
      className="cursor-move hover:fill-violet-200 transition-colors"
      onMouseDown={(e) => onMouseDown(index, e)}
    />
  );
}

"use client";

import React from "react";

interface EdgeMidpointProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  index: number;
  onMouseDown: (index: number, event: React.MouseEvent) => void;
}

export function EdgeMidpoint({
  start,
  end,
  index,
  onMouseDown,
}: EdgeMidpointProps) {
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  return (
    <circle
      cx={midpoint.x}
      cy={midpoint.y}
      r={3}
      fill="#10b981"
      stroke="#ffffff"
      strokeWidth={1}
      className="cursor-pointer opacity-60 hover:opacity-100 hover:r-4 transition-all"
      onMouseDown={(e) => onMouseDown(index, e)}
    />
  );
}

"use client";

import React, { useRef } from "react";

interface FloorCanvasWrapperProps {
  zoom: number;
  children: React.ReactNode;
}

export function FloorCanvasWrapper({ zoom, children }: FloorCanvasWrapperProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={canvasRef} className="flex-1 relative overflow-hidden bg-card">
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

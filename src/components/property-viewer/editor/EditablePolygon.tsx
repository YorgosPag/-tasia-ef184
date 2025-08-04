"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { VertexHandle } from "./VertexHandle";
import { EdgeMidpoint } from "./EdgeMidpoint";
import type { PropertyPolygon } from "../types";

interface DragState {
  isDragging: boolean;
  dragType: "vertex" | "polygon" | "edge" | null;
  dragIndex?: number;
  startPos: { x: number; y: number };
  offset: { x: number; y: number };
}

interface EditablePolygonProps {
  property: PropertyPolygon;
  isSelected: boolean;
  onVertexDrag: (vertexIndex: number, newPos: { x: number; y: number }) => void;
  onVertexAdd: (edgeIndex: number, newPos: { x: number; y: number }) => void;
  onVertexRemove: (vertexIndex: number) => void;
  onPolygonDrag: (offset: { x: number; y: number }) => void;
}

export function EditablePolygon({
  property,
  isSelected,
  onVertexDrag,
  onVertexAdd,
  onVertexRemove,
  onPolygonDrag,
}: EditablePolygonProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });

  const svgRef = useRef<SVGGElement>(null);

  const handleVertexMouseDown = useCallback(
    (vertexIndex: number, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const rect = (
        event.target as SVGElement
      ).ownerSVGElement?.getBoundingClientRect();
      if (!rect) return;

      setDragState({
        isDragging: true,
        dragType: "vertex",
        dragIndex: vertexIndex,
        startPos: { x: event.clientX - rect.left, y: event.clientY - rect.top },
        offset: { x: 0, y: 0 },
      });
    },
    [],
  );

  const handleEdgeMouseDown = useCallback(
    (edgeIndex: number, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const rect = (
        event.target as SVGElement
      ).ownerSVGElement?.getBoundingClientRect();
      if (!rect) return;

      const newPos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      onVertexAdd(edgeIndex, newPos);
    },
    [onVertexAdd],
  );

  const handlePolygonMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!isSelected) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = (
        event.target as SVGElement
      ).ownerSVGElement?.getBoundingClientRect();
      if (!rect) return;

      setDragState({
        isDragging: true,
        dragType: "polygon",
        startPos: { x: event.clientX - rect.left, y: event.clientY - rect.top },
        offset: { x: 0, y: 0 },
      });
    },
    [isSelected],
  );

  const handleVertexRightClick = useCallback(
    (vertexIndex: number, event: React.MouseEvent) => {
      event.preventDefault();
      if (property.vertices.length > 3) {
        onVertexRemove(vertexIndex);
      }
    },
    [property.vertices.length, onVertexRemove],
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragState.isDragging || !svgRef.current) return;

      const rect = svgRef.current.ownerSVGElement?.getBoundingClientRect();
      if (!rect) return;

      const currentPos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      const offset = {
        x: currentPos.x - dragState.startPos.x,
        y: currentPos.y - dragState.startPos.y,
      };

      if (dragState.dragType === "vertex" && dragState.dragIndex !== undefined) {
        const newPos = {
          x: property.vertices[dragState.dragIndex].x + offset.x,
          y: property.vertices[dragState.dragIndex].y + offset.y,
        };
        onVertexDrag(dragState.dragIndex, newPos);
      } else if (dragState.dragType === "polygon") {
        onPolygonDrag(offset);
      }

      setDragState((prev) => ({ ...prev, offset }));
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        dragType: null,
        startPos: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
      });
    };

    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, property.vertices, onVertexDrag, onPolygonDrag]);

  const pathData =
    property.vertices
      .map((vertex, index) => `${index === 0 ? "M" : "L"} ${vertex.x} ${vertex.y}`)
      .join(" ") + " Z";

  return (
    <g ref={svgRef} className="editable-polygon">
      <path
        d={pathData}
        fill={property.color}
        fillOpacity={isSelected ? 0.3 : 0.2}
        stroke={isSelected ? "#7c3aed" : property.color}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray={isSelected ? "5,5" : "none"}
        className={cn(
          "transition-all duration-200",
          isSelected ? "cursor-move" : "cursor-pointer",
        )}
        onMouseDown={handlePolygonMouseDown}
      />
      {isSelected && (
        <>
          {property.vertices.map((vertex, index) => (
            <VertexHandle
              key={`vertex-${index}`}
              vertex={vertex}
              index={index}
              isSelected={true}
              onMouseDown={handleVertexMouseDown}
            />
          ))}
          {property.vertices.map((vertex, index) => (
            <circle
              key={`delete-${index}`}
              cx={vertex.x}
              cy={vertex.y}
              r={8}
              fill="transparent"
              className="cursor-pointer"
              onContextMenu={(e) => handleVertexRightClick(index, e)}
            />
          ))}
          {property.vertices.map((vertex, index) => {
            const nextIndex = (index + 1) % property.vertices.length;
            const nextVertex = property.vertices[nextIndex];
            return (
              <EdgeMidpoint
                key={`edge-${index}`}
                start={vertex}
                end={nextVertex}
                index={index}
                onMouseDown={handleEdgeMouseDown}
              />
            );
          })}
          <path
            d={pathData}
            fill="none"
            stroke="#7c3aed"
            strokeWidth={3}
            strokeDasharray="8,4"
            opacity={0.6}
            className="pointer-events-none animate-pulse"
          />
        </>
      )}
    </g>
  );
}

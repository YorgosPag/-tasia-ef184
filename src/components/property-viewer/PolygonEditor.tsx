"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PropertyPolygon {
  id: string;
  name: string;
  type: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  vertices: Array<{ x: number; y: number }>;
  color: string;
  price?: number;
  area?: number;
}

interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: PropertyPolygon[];
}

interface PolygonEditorProps {
  floorData: FloorData;
  selectedPolygon: string | null;
  onPolygonUpdate: (polygonId: string, vertices: Array<{ x: number; y: number }>) => void;
}

interface DragState {
  isDragging: boolean;
  dragType: 'vertex' | 'polygon' | 'edge' | null;
  dragIndex?: number;
  startPos: { x: number; y: number };
  offset: { x: number; y: number };
}

// Vertex handle component
function VertexHandle({
  vertex,
  index,
  isSelected,
  onMouseDown
}: {
  vertex: { x: number; y: number };
  index: number;
  isSelected: boolean;
  onMouseDown: (index: number, event: React.MouseEvent) => void;
}) {
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

// Edge midpoint component for adding new vertices
function EdgeMidpoint({
  start,
  end,
  index,
  onMouseDown
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  index: number;
  onMouseDown: (index: number, event: React.MouseEvent) => void;
}) {
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
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

// Polygon editor component
function EditablePolygon({
  property,
  isSelected,
  onVertexDrag,
  onVertexAdd,
  onVertexRemove,
  onPolygonDrag
}: {
  property: PropertyPolygon;
  isSelected: boolean;
  onVertexDrag: (vertexIndex: number, newPos: { x: number; y: number }) => void;
  onVertexAdd: (edgeIndex: number, newPos: { x: number; y: number }) => void;
  onVertexRemove: (vertexIndex: number) => void;
  onPolygonDrag: (offset: { x: number; y: number }) => void;
}) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  const svgRef = useRef<SVGGElement>(null);

  // Handle vertex drag start
  const handleVertexMouseDown = useCallback((vertexIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = (event.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      isDragging: true,
      dragType: 'vertex',
      dragIndex: vertexIndex,
      startPos: { x: event.clientX - rect.left, y: event.clientY - rect.top },
      offset: { x: 0, y: 0 }
    });
  }, []);

  // Handle edge midpoint click (add vertex)
  const handleEdgeMouseDown = useCallback((edgeIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = (event.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;

    const newPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    onVertexAdd(edgeIndex, newPos);
  }, [onVertexAdd]);

  // Handle polygon drag start
  const handlePolygonMouseDown = useCallback((event: React.MouseEvent) => {
    if (!isSelected) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const rect = (event.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      isDragging: true,
      dragType: 'polygon',
      startPos: { x: event.clientX - rect.left, y: event.clientY - rect.top },
      offset: { x: 0, y: 0 }
    });
  }, [isSelected]);

  // Handle vertex right-click (remove)
  const handleVertexRightClick = useCallback((vertexIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (property.vertices.length > 3) { // Minimum 3 vertices for a polygon
      onVertexRemove(vertexIndex);
    }
  }, [property.vertices.length, onVertexRemove]);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragState.isDragging || !svgRef.current) return;

      const rect = svgRef.current.ownerSVGElement?.getBoundingClientRect();
      if (!rect) return;

      const currentPos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      const offset = {
        x: currentPos.x - dragState.startPos.x,
        y: currentPos.y - dragState.startPos.y
      };

      if (dragState.dragType === 'vertex' && dragState.dragIndex !== undefined) {
        const newPos = {
          x: property.vertices[dragState.dragIndex].x + offset.x,
          y: property.vertices[dragState.dragIndex].y + offset.y
        };
        onVertexDrag(dragState.dragIndex, newPos);
      } else if (dragState.dragType === 'polygon') {
        onPolygonDrag(offset);
      }

      setDragState(prev => ({ ...prev, offset }));
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        dragType: null,
        startPos: { x: 0, y: 0 },
        offset: { x: 0, y: 0 }
      });
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, property.vertices, onVertexDrag, onPolygonDrag]);

  const pathData = property.vertices
    .map((vertex, index) => `${index === 0 ? 'M' : 'L'} ${vertex.x} ${vertex.y}`)
    .join(' ') + ' Z';

  return (
    <g ref={svgRef} className="editable-polygon">
      {/* Main polygon */}
      <path
        d={pathData}
        fill={property.color}
        fillOpacity={isSelected ? 0.3 : 0.2}
        stroke={isSelected ? "#7c3aed" : property.color}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray={isSelected ? "5,5" : "none"}
        className={cn(
          "transition-all duration-200",
          isSelected ? "cursor-move" : "cursor-pointer"
        )}
        onMouseDown={handlePolygonMouseDown}
      />

      {/* Edit handles only when selected */}
      {isSelected && (
        <>
          {/* Vertex handles */}
          {property.vertices.map((vertex, index) => (
            <VertexHandle
              key={`vertex-${index}`}
              vertex={vertex}
              index={index}
              isSelected={true}
              onMouseDown={handleVertexMouseDown}
            />
          ))}

          {/* Right-click areas for vertex deletion */}
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

          {/* Edge midpoints for adding vertices */}
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

          {/* Selection indicator */}
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

export function PolygonEditor({
  floorData,
  selectedPolygon,
  onPolygonUpdate
}: PolygonEditorProps) {
  const [editedVertices, setEditedVertices] = useState<Record<string, Array<{ x: number; y: number }>>>({});

  // Get current vertices (edited or original)
  const getCurrentVertices = useCallback((polygonId: string) => {
    return editedVertices[polygonId] || floorData.properties.find(p => p.id === polygonId)?.vertices || [];
  }, [editedVertices, floorData.properties]);

  // Handle vertex drag
  const handleVertexDrag = useCallback((polygonId: string, vertexIndex: number, newPos: { x: number; y: number }) => {
    setEditedVertices(prev => {
      const currentVertices = getCurrentVertices(polygonId);
      const newVertices = [...currentVertices];
      newVertices[vertexIndex] = newPos;
      
      return {
        ...prev,
        [polygonId]: newVertices
      };
    });
  }, [getCurrentVertices]);

  // Handle vertex addition
  const handleVertexAdd = useCallback((polygonId: string, edgeIndex: number, newPos: { x: number; y: number }) => {
    setEditedVertices(prev => {
      const currentVertices = getCurrentVertices(polygonId);
      const newVertices = [...currentVertices];
      newVertices.splice(edgeIndex + 1, 0, newPos);
      
      return {
        ...prev,
        [polygonId]: newVertices
      };
    });
  }, [getCurrentVertices]);

  // Handle vertex removal
  const handleVertexRemove = useCallback((polygonId: string, vertexIndex: number) => {
    setEditedVertices(prev => {
      const currentVertices = getCurrentVertices(polygonId);
      if (currentVertices.length <= 3) return prev; // Minimum 3 vertices
      
      const newVertices = currentVertices.filter((_, index) => index !== vertexIndex);
      
      return {
        ...prev,
        [polygonId]: newVertices
      };
    });
  }, [getCurrentVertices]);

  // Handle polygon drag
  const handlePolygonDrag = useCallback((polygonId: string, offset: { x: number; y: number }) => {
    setEditedVertices(prev => {
      const currentVertices = getCurrentVertices(polygonId);
      const newVertices = currentVertices.map(vertex => ({
        x: vertex.x + offset.x,
        y: vertex.y + offset.y
      }));
      
      return {
        ...prev,
        [polygonId]: newVertices
      };
    });
  }, [getCurrentVertices]);

  // Save changes when vertices are updated
  useEffect(() => {
    Object.entries(editedVertices).forEach(([polygonId, vertices]) => {
      onPolygonUpdate(polygonId, vertices);
    });
  }, [editedVertices, onPolygonUpdate]);

  return (
    <g className="polygon-editor">
      {floorData.properties.map((property) => {
        const currentVertices = getCurrentVertices(property.id);
        const editedProperty = {
          ...property,
          vertices: currentVertices
        };

        return (
          <EditablePolygon
            key={property.id}
            property={editedProperty}
            isSelected={selectedPolygon === property.id}
            onVertexDrag={(vertexIndex, newPos) => handleVertexDrag(property.id, vertexIndex, newPos)}
            onVertexAdd={(edgeIndex, newPos) => handleVertexAdd(property.id, edgeIndex, newPos)}
            onVertexRemove={(vertexIndex) => handleVertexRemove(property.id, vertexIndex)}
            onPolygonDrag={(offset) => handlePolygonDrag(property.id, offset)}
          />
        );
      })}

      {/* Instructions overlay */}
      {selectedPolygon && (
        <g className="instructions">
          <rect
            x={10}
            y={60}
            width={280}
            height={80}
            fill="white"
            fillOpacity={0.95}
            stroke="#d1d5db"
            strokeWidth={1}
            rx={4}
            className="drop-shadow-sm"
          />
          <text x={20} y={80} fontSize="11" fill="#374151" className="font-medium">
            Οδηγίες Επεξεργασίας:
          </text>
          <text x={20} y={95} fontSize="10" fill="#6b7280">
            • Σύρετε τους κόμβους για μετακίνηση
          </text>
          <text x={20} y={108} fontSize="10" fill="#6b7280">
            • Κλικ στα πράσινα σημεία για προσθήκη κόμβου
          </text>
          <text x={20} y={121} fontSize="10" fill="#6b7280">
            • Δεξί κλικ σε κόμβο για διαγραφή
          </text>
          <text x={20} y={134} fontSize="10" fill="#6b7280">
            • Σύρετε το πολύγωνο για μετακίνηση
          </text>
        </g>
      )}
    </g>
  );
}

"use client";

import { usePolygonEdit } from "@/hooks/usePolygonEdit";
import { EditablePolygon } from "./editor/EditablePolygon";
import { PolygonEditorInstructions } from "./editor/PolygonEditorInstructions";
import type { FloorData } from "./types";

interface PolygonEditorProps {
  floorData: FloorData;
  selectedPolygon: string | null;
  onPolygonUpdate: (
    polygonId: string,
    vertices: Array<{ x: number; y: number }>,
  ) => void;
  isCreatingPolygon: boolean;
  onPolygonCreated: (vertices: Array<{ x: number; y: number }>) => void;
}

export function PolygonEditor({
  floorData,
  selectedPolygon,
  onPolygonUpdate,
}: PolygonEditorProps) {
  const {
    getVertices,
    dragVertex,
    addVertex,
    removeVertex,
    dragPolygon,
  } = usePolygonEdit(floorData, onPolygonUpdate);

  return (
    <g className="polygon-editor">
      {floorData.properties.map((property) => (
        <EditablePolygon
          key={property.id}
          property={{ ...property, vertices: getVertices(property.id) }}
          isSelected={selectedPolygon === property.id}
          onVertexDrag={(i, pos) => dragVertex(property.id, i, pos)}
          onVertexAdd={(i, pos) => addVertex(property.id, i, pos)}
          onVertexRemove={(i) => removeVertex(property.id, i)}
          onPolygonDrag={(offset) => dragPolygon(property.id, offset)}
        />
      ))}

      {selectedPolygon && <PolygonEditorInstructions />}
    </g>
  );
}

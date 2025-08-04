"use client";

import { useState, useCallback } from "react";
import type { FloorData } from "@/components/property-viewer/types";

export function usePolygonEdit(
  floorData: FloorData,
  onPolygonUpdate: (
    polygonId: string,
    vertices: Array<{ x: number; y: number }>,
  ) => void,
) {
  const [editedVertices, setEditedVertices] = useState<
    Record<string, Array<{ x: number; y: number }>>
  >({});

  const getVertices = useCallback(
    (polygonId: string) => {
      return (
        editedVertices[polygonId] ||
        floorData.properties.find((p) => p.id === polygonId)?.vertices ||
        []
      );
    },
    [editedVertices, floorData.properties],
  );

  const updateVertices = (
    polygonId: string,
    newVertices: Array<{ x: number; y: number }>,
  ) => {
    setEditedVertices((prev) => ({
      ...prev,
      [polygonId]: newVertices,
    }));
    onPolygonUpdate(polygonId, newVertices);
  };

  const dragVertex = useCallback(
    (polygonId: string, vertexIndex: number, newPos: { x: number; y: number }) => {
      const currentVertices = getVertices(polygonId);
      const newVertices = [...currentVertices];
      newVertices[vertexIndex] = newPos;
      updateVertices(polygonId, newVertices);
    },
    [getVertices],
  );

  const addVertex = useCallback(
    (polygonId: string, edgeIndex: number, newPos: { x: number; y: number }) => {
      const currentVertices = getVertices(polygonId);
      const newVertices = [...currentVertices];
      newVertices.splice(edgeIndex + 1, 0, newPos);
      updateVertices(polygonId, newVertices);
    },
    [getVertices],
  );

  const removeVertex = useCallback(
    (polygonId: string, vertexIndex: number) => {
      const currentVertices = getVertices(polygonId);
      if (currentVertices.length <= 3) return;
      const newVertices = currentVertices.filter((_, i) => i !== vertexIndex);
      updateVertices(polygonId, newVertices);
    },
    [getVertices],
  );

  const dragPolygon = useCallback(
    (polygonId: string, offset: { x: number; y: number }) => {
      const currentVertices = getVertices(polygonId);
      const newVertices = currentVertices.map((vertex) => ({
        x: vertex.x + offset.x,
        y: vertex.y + offset.y,
      }));
      updateVertices(polygonId, newVertices);
    },
    [getVertices],
  );

  return {
    getVertices,
    dragVertex,
    addVertex,
    removeVertex,
    dragPolygon,
    editedVertices,
  };
}

"use client";

import { useState, useCallback } from "react";

interface UseCanvasInteractionsProps {
  isCreatingPolygon: boolean;
  onPolygonCreated: (vertices: Array<{ x: number; y: number }>) => void;
  onPolygonSelect: (propertyId: string | null) => void;
  onPolygonHover: (propertyId: string | null) => void;
}

export function useCanvasInteractions({
  isCreatingPolygon,
  onPolygonCreated,
  onPolygonSelect,
  onPolygonHover,
}: UseCanvasInteractionsProps) {
  const [creatingVertices, setCreatingVertices] = useState<Array<{ x: number; y: number }>>([]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isCreatingPolygon) {
      const rect = event.currentTarget.getBoundingClientRect();
      const newVertex = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setCreatingVertices((prev) => [...prev, newVertex]);
    } else if (event.target === event.currentTarget) {
      onPolygonSelect(null);
    }
  }, [isCreatingPolygon, onPolygonSelect]);

  const handleCanvasDoubleClick = useCallback(() => {
    if (isCreatingPolygon && creatingVertices.length >= 3) {
      onPolygonCreated(creatingVertices);
      setCreatingVertices([]);
    }
  }, [isCreatingPolygon, creatingVertices, onPolygonCreated]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target === event.currentTarget) {
      onPolygonHover(null);
    }
  }, [onPolygonHover]);

  return {
    handleCanvasClick,
    handleCanvasDoubleClick,
    handleCanvasMouseMove,
    creatingVertices,
  };
}
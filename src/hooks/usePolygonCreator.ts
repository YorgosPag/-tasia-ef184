"use client";

import { useState, useCallback } from "react";

export function usePolygonCreator() {
  const [isCreatingPolygon, setIsCreatingPolygon] = useState(false);

  const startCreatingPolygon = useCallback(() => {
    setIsCreatingPolygon(true);
  }, []);

  const handlePolygonCreated = useCallback(
    (vertices: Array<{ x: number; y: number }>) => {
      console.log("New polygon created with vertices:", vertices);
      setIsCreatingPolygon(false);

      // This is where you would typically update your main state
      // For now, we just log it.
      const newProperty = {
        id: `prop-${Date.now()}`,
        name: `Νέο Ακίνητο ${Date.now()}`,
        type: "Διαμέρισμα",
        status: "for-sale" as const,
        color: "#10b981",
        vertices: vertices,
        price: 100000,
        area: 50,
      };
      console.log("Would add property:", newProperty);
    },
    [],
  );

  return {
    isCreatingPolygon,
    startCreatingPolygon,
    handlePolygonCreated,
  };
}

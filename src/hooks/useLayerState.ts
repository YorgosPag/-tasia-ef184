"use client";

import { useState, useEffect } from "react";
import type { PropertyPolygon } from "@/components/property-viewer/types";

interface LayerState {
  visible: boolean;
  locked: boolean;
  opacity: number;
}

export function useLayerState(properties: PropertyPolygon[]) {
  const [layerStates, setLayerStates] = useState<Record<string, LayerState>>(
    {},
  );

  useEffect(() => {
    const initialStates: Record<string, LayerState> = {};
    properties.forEach((property) => {
      initialStates[property.id] = {
        visible: true,
        locked: false,
        opacity: 0.7,
      };
    });
    setLayerStates(initialStates);
  }, [properties]);

  const toggleVisibility = (propertyId: string) => {
    setLayerStates((prev) => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        visible: !prev[propertyId].visible,
      },
    }));
  };

  const toggleLock = (propertyId: string) => {
    setLayerStates((prev) => ({
      ...prev,
      [propertyId]: { ...prev[propertyId], locked: !prev[propertyId].locked },
    }));
  };

  const changeOpacity = (propertyId: string, opacity: number) => {
    setLayerStates((prev) => ({
      ...prev,
      [propertyId]: { ...prev[propertyId], opacity },
    }));
  };

  const hideAll = () => {
    setLayerStates((prev) => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach((id) => {
        newStates[id] = { ...newStates[id], visible: false };
      });
      return newStates;
    });
  };

  const showAll = () => {
    setLayerStates((prev) => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach((id) => {
        newStates[id] = { ...newStates[id], visible: true };
      });
      return newStates;
    });
  };

  return {
    layerStates,
    toggleVisibility,
    toggleLock,
    changeOpacity,
    hideAll,
    showAll,
  };
}

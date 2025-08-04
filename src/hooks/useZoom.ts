"use client";

import { useState, useCallback } from "react";

export function useZoom(initialZoom = 1, minZoom = 0.2, maxZoom = 5, step = 1.2) {
  const [zoom, setZoom] = useState(initialZoom);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * step, maxZoom));
  }, [maxZoom, step]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / step, minZoom));
  }, [minZoom, step]);

  const reset = useCallback(() => {
    setZoom(initialZoom);
  }, [initialZoom]);

  return { zoom, zoomIn, zoomOut, reset, setZoom };
}

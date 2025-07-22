
'use client';
import { useState, useEffect } from 'react';
import { useLocalStorageState } from '../../use-local-storage-state';

interface UseZoomProps {
  pdfContainerRef: React.RefObject<HTMLDivElement>;
  pageDimensions: {
    width: number;
    height: number;
    cropBox: { x: number; y: number; width: number; height: number };
  };
  isPrecisionZooming: boolean;
}

/**
 * useZoom
 * A hook to manage all state and logic related to PDF zoom and rotation.
 * It persists the scale and rotation values to localStorage.
 */
export function useZoom({ pdfContainerRef, pageDimensions, isPrecisionZooming }: UseZoomProps) {
  const [scale, setScale] = useLocalStorageState('floorPlanScale', 1.0);
  const [rotation, setRotation] = useLocalStorageState('floorPlanRotation', 0);
  const [zoomInput, setZoomInput] = useState(`${(scale * 100).toFixed(0)}%`);

  // Sync zoom input with scale state
  useEffect(() => {
    setZoomInput(`${(scale * 100).toFixed(0)}%`);
  }, [scale]);
  
  // Effect to center the view when scale or dimensions change
  useEffect(() => {
    const container = pdfContainerRef.current;
    if (container && !isPrecisionZooming) {
        // We use a small timeout to allow the DOM to update before scrolling
        setTimeout(() => {
            container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
            container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
        }, 50);
    }
  }, [scale, pageDimensions, pdfContainerRef, isPrecisionZooming]); 


  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomInput(e.target.value);
  };

  const handleZoomInputBlur = () => {
    const newScale = parseFloat(zoomInput) / 100;
    if (!isNaN(newScale) && newScale > 0) {
      // Clamp the scale between a reasonable min/max
      setScale(Math.max(0.05, Math.min(newScale, 10)));
    } else {
      setZoomInput(`${(scale * 100).toFixed(0)}%`); // Revert on invalid input
    }
  };

  const handleZoomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleZoomInputBlur();
      (e.target as HTMLInputElement).blur(); // Remove focus
    } else if (e.key === 'Escape') {
      setZoomInput(`${(scale * 100).toFixed(0)}%`);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleFitToView = () => {
    const container = pdfContainerRef.current;
    if (!container || !pageDimensions.cropBox || pageDimensions.cropBox.width === 0) return;

    const PADDING = 0.95; // 95% of view to leave some margin
    const { clientWidth, clientHeight } = container;
    const { width: cropWidth, height: cropHeight } = pageDimensions.cropBox;

    if (cropWidth <= 0 || cropHeight <= 0) return;

    const scaleX = (clientWidth / cropWidth) * PADDING;
    const scaleY = (clientHeight / cropHeight) * PADDING;

    const newScale = Math.min(scaleX, scaleY);
    setScale(newScale);
  };

  return {
    scale,
    setScale,
    rotation,
    setRotation,
    zoomInput,
    setZoomInput,
    handleZoomInputChange,
    handleZoomInputBlur,
    handleZoomInputKeyDown,
    handleFitToView,
  };
}

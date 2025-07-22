
'use client';
import { useState, useEffect, useRef } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

interface UseZoomProps {
  pdfContainerRef: React.RefObject<HTMLDivElement>;
  pageDimensions: {
    width: number;
    height: number;
    cropBox: { x: number; y: number; width: number; height: number };
  };
  isPrecisionZooming: boolean;
}

export function useZoom({ pdfContainerRef, pageDimensions, isPrecisionZooming }: UseZoomProps) {
  const [scale, setScale] = useLocalStorageState('floorPlanScale', 1.0);
  const [rotation, setRotation] = useLocalStorageState('floorPlanRotation', 0);
  const [zoomInput, setZoomInput] = useState(`${(scale * 100).toFixed(0)}%`);

  useEffect(() => {
    setZoomInput(`${(scale * 100).toFixed(0)}%`);
  }, [scale]);
  
  useEffect(() => {
    const container = pdfContainerRef.current;
    if (container && !isPrecisionZooming) {
        setTimeout(() => {
            container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
            container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
        }, 50);
    }
  }, [scale, pageDimensions, isPrecisionZooming, pdfContainerRef]); 


  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomInput(e.target.value);
  };

  const handleZoomInputBlur = () => {
    const newScale = parseFloat(zoomInput) / 100;
    if (!isNaN(newScale) && newScale > 0) {
      setScale(Math.max(0.05, Math.min(newScale, 10)));
    } else {
      setZoomInput(`${(scale * 100).toFixed(0)}%`);
    }
  };

  const handleZoomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleZoomInputBlur();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setZoomInput(`${(scale * 100).toFixed(0)}%`);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleFitToView = () => {
    const container = pdfContainerRef.current;
    if (!container || !pageDimensions.cropBox || pageDimensions.cropBox.width === 0) return;

    const PADDING = 0.95;
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

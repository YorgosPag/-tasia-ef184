
'use client';
import { useState, useEffect, useRef, MutableRefObject } from 'react';

interface UsePrecisionZoomProps {
  isEditMode: boolean;
  lastMouseEvent: MutableRefObject<MouseEvent | null>;
  pdfContainerRef: React.RefObject<HTMLDivElement>;
  currentScale: number;
  setScale: (value: React.SetStateAction<number>) => void;
}

const PRECISION_ZOOM_SCALE = 2.5;

/**
 * usePrecisionZoom
 * A hook to handle the "precision zoom" (magnifying glass) functionality
 * triggered by holding the Shift key in edit mode.
 * @returns {boolean} A boolean indicating if precision zoom is currently active.
 */
export function usePrecisionZoom({
  isEditMode,
  lastMouseEvent,
  pdfContainerRef,
  currentScale,
  setScale,
}: UsePrecisionZoomProps): boolean {
  const [isPrecisionZooming, setIsPrecisionZooming] = useState(false);
  const preZoomState = useRef({ scale: 1.0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    const pdfContainer = pdfContainerRef.current;
    if (!pdfContainer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if an input is focused, not in edit mode, or already zooming
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        !isEditMode ||
        isPrecisionZooming ||
        !lastMouseEvent.current
      ) {
        return;
      }

      if (e.key === 'Shift') {
        e.preventDefault();
        setIsPrecisionZooming(true);

        // Store current state to restore it later
        preZoomState.current = {
          scale: currentScale,
          scrollLeft: pdfContainer.scrollLeft,
          scrollTop: pdfContainer.scrollTop,
        };

        const rect = pdfContainer.getBoundingClientRect();
        const mouseX = lastMouseEvent.current.clientX - rect.left;
        const mouseY = lastMouseEvent.current.clientY - rect.top;

        // Calculate the point on the unscaled content to center on
        const pointX = (preZoomState.current.scrollLeft + mouseX) / preZoomState.current.scale;
        const pointY = (preZoomState.current.scrollTop + mouseY) / preZoomState.current.scale;
        
        setScale(PRECISION_ZOOM_SCALE);

        // After re-render with new scale, adjust scroll to center the point
        setTimeout(() => {
          if (pdfContainerRef.current) {
            const newScrollLeft = (pointX * PRECISION_ZOOM_SCALE) - (pdfContainerRef.current.clientWidth / 2);
            const newScrollTop = (pointY * PRECISION_ZOOM_SCALE) - (pdfContainerRef.current.clientHeight / 2);
            pdfContainerRef.current.scrollLeft = newScrollLeft;
            pdfContainerRef.current.scrollTop = newScrollTop;
          }
        }, 0);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift' && isPrecisionZooming) {
        e.preventDefault();
        setIsPrecisionZooming(false);
        setScale(preZoomState.current.scale); // Restore original scale

        // Restore original scroll position
        setTimeout(() => {
          if (pdfContainerRef.current) {
            pdfContainerRef.current.scrollLeft = preZoomState.current.scrollLeft;
            pdfContainerRef.current.scrollTop = preZoomState.current.scrollTop;
          }
        }, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    isEditMode,
    isPrecisionZooming,
    currentScale,
    setScale,
    pdfContainerRef,
    lastMouseEvent,
  ]);

  return isPrecisionZooming;
}

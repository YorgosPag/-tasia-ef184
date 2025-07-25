
'use client';

import { useState, useCallback, MutableRefObject } from 'react';
import { PDFPageProxy } from 'react-pdf';
import { Unit } from '@/components/floor-plan/Unit';

interface PageDimensions {
  width: number;
  height: number;
  cropBox: { x: number; y: number; width: number; height: number };
}

interface UsePdfHandlersProps {
  svgRef: React.RefObject<SVGSVGElement>;
  isEditMode: boolean;
  isLocked: boolean;
  draggingPoint: { unitId: string; pointIndex: number } | null;
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  lastMouseEvent: MutableRefObject<MouseEvent | null>;
  setDrawingPolygon: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
  setDraggingPoint: React.Dispatch<React.SetStateAction<{ unitId: string; pointIndex: number } | null>>;
  onUnitPointsUpdate: (unitId: string, newPoints: { x: number; y: number }[]) => void;
  setPageDimensions: React.Dispatch<React.SetStateAction<PageDimensions>>;
}

/**
 * usePdfHandlers
 * A hook to encapsulate all direct event handlers for the PDF/SVG canvas.
 * This includes logic for clicking to draw, dragging points, and handling document/page load events.
 * It keeps the PdfCanvas component clean of complex logic.
 */
export function usePdfHandlers({
  svgRef,
  isEditMode,
  isLocked,
  draggingPoint,
  setUnits,
  lastMouseEvent,
  setDrawingPolygon,
  setDraggingPoint,
  onUnitPointsUpdate,
  setPageDimensions,
}: UsePdfHandlersProps) {
  const [pdfError, setPdfError] = useState<string | null>(null);

  const getSvgPoint = useCallback(
    (e: React.MouseEvent<SVGSVGElement> | MouseEvent) => {
      if (!svgRef.current) return null;
      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      return point.matrixTransform(svg.getScreenCTM()?.inverse());
    },
    [svgRef]
  );

  const onDocumentLoadSuccess = () => {
    setPdfError(null);
  };

  const onPageLoadSuccess = async (page: PDFPageProxy) => {
    const originalViewport = page.getViewport({ scale: 1 });
  
    // Create an in-memory canvas to analyze the PDF content for auto-cropping
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
        setPageDimensions({ width: originalViewport.width, height: originalViewport.height, cropBox: { x: 0, y: 0, width: originalViewport.width, height: originalViewport.height } });
        return;
    }
  
    canvas.width = originalViewport.width;
    canvas.height = originalViewport.height;
  
    const renderContext = {
      canvasContext: context,
      viewport: originalViewport,
    };
    await page.render(renderContext).promise;
  
    // Analyze the canvas to find the content bounding box
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
  
    // Check for non-white pixels (with a tolerance for off-white)
    const isWhite = (r: number, g: number, b: number, a: number) => a === 0 || (r > 240 && g > 240 && b > 240);
  
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        if (!isWhite(data[i], data[i+1], data[i+2], data[i+3])) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    // Fallback if no content is found (e.g., blank page)
    if (maxX === -1) {
        minX = 0; minY = 0; maxX = canvas.width; maxY = canvas.height;
    }
  
    const padding = 20; // Add some padding around the detected content
    const cropBox = {
        x: Math.max(0, minX - padding),
        y: Math.max(0, minY - padding),
        width: Math.min(canvas.width, (maxX - minX) + 2 * padding),
        height: Math.min(canvas.height, (maxY - minY) + 2 * padding),
    };
    
    setPageDimensions({ 
        width: originalViewport.width, 
        height: originalViewport.height,
        cropBox
    });
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditMode || isLocked) return;
    const point = getSvgPoint(e);
    if (point) {
      setDrawingPolygon((prev) => [...prev, { x: point.x, y: point.y }]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    lastMouseEvent.current = event.nativeEvent;
    if (isLocked || !draggingPoint) return;
    const svgPoint = getSvgPoint(event);
    if (!svgPoint) return;

    // Optimistic UI: Update the local state immediately via the parent.
    // The parent hook is responsible for the eventual Firestore update.
    setUnits((prevUnits) =>
      prevUnits.map((unit) => {
        if (unit.id === draggingPoint.unitId) {
          const newPoints = [...(unit.polygonPoints || [])];
          newPoints[draggingPoint.pointIndex] = { x: svgPoint.x, y: svgPoint.y };
          return { ...unit, polygonPoints: newPoints };
        }
        return unit;
      })
    );
  };

  const handleMouseUp = () => {
    if (draggingPoint) {
      // Find the unit and its final points to send for saving.
      setUnits((prevUnits) => {
        const unit = prevUnits.find((u) => u.id === draggingPoint.id);
        if (unit && unit.polygonPoints) {
          onUnitPointsUpdate(unit.id, unit.polygonPoints);
        }
        return prevUnits;
      });
      setDraggingPoint(null);
    }
  };
  
  const handleMouseLeave = () => {
    // Stop dragging if the mouse leaves the canvas to prevent weird states
    if (draggingPoint) {
      handleMouseUp();
    }
  };

  const handlePointMouseDown = (event: React.MouseEvent<SVGCircleElement>, unitId: string, pointIndex: number) => {
    if (isLocked || isEditMode) return;
    event.stopPropagation(); // Prevent the main SVG click handler from firing
    setDraggingPoint({ unitId, pointIndex });
  };

  return {
    pdfError,
    onDocumentLoadSuccess,
    onPageLoadSuccess,
    handleSvgClick,
    handleMouseMove,
    handleMouseUp,
    handlePointMouseDown,
    handleMouseLeave,
    getSvgPoint,
  };
}

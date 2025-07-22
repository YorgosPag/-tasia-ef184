
'use client';

import { useState, useCallback, MutableRefObject } from 'react';
import { PDFPageProxy } from 'react-pdf';
import { Unit } from '../FloorPlanViewer';

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
  lastMouseEvent: MutableRefObject<MouseEvent | null>;
  setDrawingPolygon: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
  setDraggingPoint: React.Dispatch<React.SetStateAction<{ unitId: string; pointIndex: number } | null>>;
  setLocalUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
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
  lastMouseEvent,
  setDrawingPolygon,
  setDraggingPoint,
  setLocalUnits,
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
    // This logic could be expanded to auto-crop, for now we use full dimensions
    setPageDimensions({
      width: originalViewport.width,
      height: originalViewport.height,
      cropBox: { x: 0, y: 0, width: originalViewport.width, height: originalViewport.height },
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

    setLocalUnits((prevUnits) =>
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
      setLocalUnits((prevUnits) => {
        const unit = prevUnits.find((u) => u.id === draggingPoint.unitId);
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


'use client';

import React, { useRef, MutableRefObject } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2 } from 'lucide-react';
import { Unit } from './FloorPlanViewer';
import { usePdfHandlers } from '@/hooks/floor-plan/usePdfHandlers';
import { DrawingLayers } from './DrawingLayers';
import { UnitLayers } from './UnitLayers';

// Set worker path for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface PageDimensions {
  width: number;
  height: number;
  cropBox: { x: number; y: number; width: number; height: number };
}

interface PdfCanvasProps {
  pdfUrl: string;
  units: Unit[];
  statusVisibility: Record<Unit['status'], boolean>;
  statusColors: Record<Unit['status'], string>;
  isLocked: boolean;
  isEditMode: boolean;
  drawingPolygon: { x: number; y: number }[];
  draggingPoint: { unitId: string; pointIndex: number } | null;
  lastMouseEvent: MutableRefObject<MouseEvent | null>;
  isPrecisionZooming: boolean;
  pageDimensions: PageDimensions;
  pdfContainerRef: React.RefObject<HTMLDivElement>;
  zoom: { scale: number; rotation: number };
  setPageDimensions: React.Dispatch<React.SetStateAction<PageDimensions>>;
  setDrawingPolygon: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
  setDraggingPoint: React.Dispatch<React.SetStateAction<{ unitId: string; pointIndex: number } | null>>;
  setLocalUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  onUnitPointsUpdate: (unitId: string, newPoints: { x: number; y: number }[]) => void;
  onUnitClick: (unitId: string) => void;
  onUnitDelete: (unitId: string) => void;
}

const LoadingElement = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
    <Loader2 className="h-12 w-12 animate-spin" />
    <p>Φόρτωση και ανάλυση κάτοψης...</p>
  </div>
);

/**
 * PdfCanvas
 * Renders the PDF floor plan with all SVG overlays (units, drawing layers).
 * All event/mutation logic is handled via props and hooks.
 */
export function PdfCanvas({
  pdfUrl,
  units,
  statusVisibility,
  statusColors,
  isLocked,
  isEditMode,
  drawingPolygon,
  draggingPoint,
  lastMouseEvent,
  isPrecisionZooming,
  pageDimensions,
  pdfContainerRef,
  zoom,
  setPageDimensions,
  setDrawingPolygon,
  setDraggingPoint,
  setLocalUnits,
  onUnitPointsUpdate,
  onUnitClick,
  onUnitDelete,
}: PdfCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    pdfError,
    onDocumentLoadSuccess,
    onPageLoadSuccess,
    handleSvgClick,
    handleMouseMove,
    handleMouseUp,
    handlePointMouseDown,
    handleMouseLeave,
    getSvgPoint,
  } = usePdfHandlers({
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
  });
  
  const visibleUnits = units.filter((unit) => statusVisibility[unit.status] ?? true);
  const { cropBox } = pageDimensions;
  const croppedAspectRatio = cropBox.width > 0 ? cropBox.width / cropBox.height : 1;

  // Center the view whenever the scale changes, unless precision zooming.
  // This is better handled here than a useEffect to ensure it runs after render.
  React.useEffect(() => {
    const container = pdfContainerRef.current;
    if (container && !isPrecisionZooming) {
        // We use a small timeout to allow the DOM to update before scrolling
        setTimeout(() => {
            container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
            container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
        }, 50);
    }
  }, [zoom.scale, pageDimensions, pdfContainerRef, isPrecisionZooming]);

  return (
    <div
      ref={pdfContainerRef}
      className="flex w-full items-start justify-center rounded-lg border bg-muted/20"
      style={{ height: '40vh', overflow: 'auto' }}
      onMouseUp={handleMouseUp}
    >
      {pdfError ? (
        <div className="flex h-full items-center justify-center p-4 text-center text-destructive">
          {pdfError}
        </div>
      ) : (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error(error)}
          loading={<LoadingElement />}
          className="flex items-start justify-start"
        >
          <div className="relative" style={{ aspectRatio: croppedAspectRatio }}>
            <Page
              pageNumber={1}
              scale={zoom.scale}
              rotate={zoom.rotation}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={onPageLoadSuccess}
              customTextRenderer={() => false}
            />
            {pageDimensions.width > 0 && (
              <svg
                ref={svgRef}
                className="absolute left-0 top-0"
                width={pageDimensions.width * zoom.scale}
                height={pageDimensions.height * zoom.scale}
                viewBox={`${cropBox.x} ${cropBox.y} ${cropBox.width} ${cropBox.height}`}
                style={{
                  pointerEvents: 'auto',
                  cursor: isLocked ? 'not-allowed' : isEditMode ? 'crosshair' : 'default',
                }}
                onClick={handleSvgClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <DrawingLayers
                  isEditMode={isEditMode}
                  lastMouseEvent={lastMouseEvent}
                  getSvgPoint={getSvgPoint}
                  pageDimensions={pageDimensions}
                  scale={zoom.scale}
                  drawingPolygon={drawingPolygon}
                />
                <UnitLayers
                  units={visibleUnits}
                  statusColors={statusColors}
                  isEditMode={isEditMode}
                  isLocked={isLocked}
                  scale={zoom.scale}
                  onUnitClick={onUnitClick}
                  onUnitDelete={onUnitDelete}
                  handlePointMouseDown={handlePointMouseDown}
                />
              </svg>
            )}
          </div>
        </Document>
      )}
    </div>
  );
}

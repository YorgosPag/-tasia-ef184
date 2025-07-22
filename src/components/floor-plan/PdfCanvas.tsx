
'use client';

import React, { useRef, MutableRefObject } from 'react';
import { Document, Page, pdfjs, PDFPageProxy } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2 } from 'lucide-react';
import { PolygonPopover } from './PolygonPopover';
import { Unit } from './FloorPlanViewer';
import { usePdfHandlers } from './hooks/usePdfHandlers';
import { getStatusColor } from './utils';
import { cn } from '@/lib/utils';

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

export function PdfCanvas({
  pdfUrl,
  units,
  statusVisibility,
  isLocked,
  isEditMode,
  drawingPolygon,
  draggingPoint,
  isPrecisionZooming,
  lastMouseEvent,
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
  
  const visibleUnits = units.filter((unit) => statusVisibility[unit.status]);
  const { cropBox } = pageDimensions;
  const croppedAspectRatio = cropBox.width > 0 ? cropBox.width / cropBox.height : 1;

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
                {/* Drawing and interaction layers */}
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

// Sub-component for drawing-related SVG elements
function DrawingLayers({
  isEditMode,
  lastMouseEvent,
  getSvgPoint,
  pageDimensions,
  scale,
  drawingPolygon,
}: any) {
  return (
    <>
      {isEditMode && lastMouseEvent.current && (
        <g className="pointer-events-none">
          <line
            x1={0} y1={getSvgPoint(lastMouseEvent.current)?.y || 0}
            x2={pageDimensions.width} y2={getSvgPoint(lastMouseEvent.current)?.y || 0}
            stroke="hsl(var(--destructive))"
            strokeWidth={0.8 / scale}
            strokeDasharray={`${4 / scale} ${4 / scale}`}
          />
          <line
            x1={getSvgPoint(lastMouseEvent.current)?.x || 0} y1={0}
            x2={getSvgPoint(lastMouseEvent.current)?.x || 0} y2={pageDimensions.height}
            stroke="hsl(var(--destructive))"
            strokeWidth={0.8 / scale}
            strokeDasharray={`${4 / scale} ${4 / scale}`}
          />
        </g>
      )}
      {isEditMode && drawingPolygon.length > 0 && (
        <g className="pointer-events-none">
          <polygon
            points={drawingPolygon.map((p: any) => `${p.x},${p.y}`).join(' ')}
            fill="hsl(var(--primary) / 0.3)"
            stroke="hsl(var(--primary))"
            strokeWidth={1.5 / scale}
          />
          {drawingPolygon.map((point: any, index: number) => (
            <circle key={`drawing-point-${index}`} cx={point.x} cy={point.y} r={4 / scale} fill="hsl(var(--primary))" />
          ))}
        </g>
      )}
    </>
  );
}

// Sub-component for unit-related SVG elements
function UnitLayers({
  units,
  isEditMode,
  isLocked,
  scale,
  onUnitClick,
  onUnitDelete,
  handlePointMouseDown,
}: any) {
  return (
    <>
      <g>
        {units.map((unit: Unit) =>
          unit.polygonPoints ? (
            <PolygonPopover
              key={unit.id}
              unit={unit}
              isEditMode={isEditMode}
              isLocked={isLocked}
              scale={scale}
              onUnitClick={onUnitClick}
              onUnitDelete={onUnitDelete}
            />
          ) : null
        )}
      </g>
      <g>
        {!isEditMode && !isLocked && units.map((unit: Unit) =>
          unit.polygonPoints?.map((point, index) => (
            <circle
              key={`${unit.id}-point-${index}`}
              cx={point.x}
              cy={point.y}
              r={5 / scale}
              fill={getStatusColor(unit.status)}
              stroke="#fff"
              strokeWidth={1.5 / scale}
              onMouseDown={(e) => handlePointMouseDown(e, unit.id, index)}
              className="cursor-move transition-all hover:r-7 hover:stroke-2"
            />
          ))
        )}
      </g>
    </>
  );
}

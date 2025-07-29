
'use client';

import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { useFloorPlanState } from '@/hooks/floor-plan/useFloorPlanState';
import { usePdfHandlers } from '@/hooks/floor-plan/usePdfHandlers';
import { Unit } from '@/tasia/components/floor-plan/Unit';
import { SvgOverlay } from './SvgOverlay';
import { FloorPlanLoader } from './FloorPlanLoader';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FloorPlanViewerProps {
  pdfUrl?: string;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  onPolygonDrawn: (points: { x: number; y: number }[]) => void;
  onUnitClick: (unitId: string) => void;
  onUnitPointsUpdate: (unitId: string, newPoints: { x: number; y: number }[]) => void;
  highlightedUnitId: string | null;
}

export function FloorPlanViewer({
  pdfUrl,
  units,
  setUnits,
  onPolygonDrawn,
  onUnitClick,
  onUnitPointsUpdate,
  highlightedUnitId,
}: FloorPlanViewerProps) {
  const floorPlanState = useFloorPlanState({ onPolygonDrawn });
  const svgRef = React.useRef<SVGSVGElement>(null);

  const pdfHandlers = usePdfHandlers({
    svgRef,
    isEditMode: floorPlanState.isEditMode,
    isLocked: floorPlanState.isLocked,
    draggingPoint: floorPlanState.draggingPoint,
    setUnits,
    lastMouseEvent: floorPlanState.lastMouseEvent,
    setDrawingPolygon: floorPlanState.setDrawingPolygon,
    setDraggingPoint: floorPlanState.setDraggingPoint,
    onUnitPointsUpdate,
    setPageDimensions: floorPlanState.setPageDimensions,
  });

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Δεν έχει ανεβεί κάτοψη για αυτόν τον όροφο.</p>
        <p className="text-sm text-muted-foreground mt-2">Παρακαλώ ανεβάστε ένα αρχείο PDF.</p>
      </div>
    );
  }

  return (
    <div
      ref={floorPlanState.pdfContainerRef}
      className="relative overflow-auto w-full h-[75vh] bg-muted/30 border-2 border-dashed rounded-lg"
      onMouseUp={pdfHandlers.handleMouseUp}
      onMouseLeave={pdfHandlers.handleMouseLeave}
    >
      <div
        className="absolute"
        style={{
          transform: `scale(${floorPlanState.zoom.scale}) rotate(${floorPlanState.zoom.rotation}deg)`,
          transformOrigin: 'top left',
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={pdfHandlers.onDocumentLoadSuccess}
          loading={<FloorPlanLoader />}
          error={<p className="text-red-500 p-4">Failed to load PDF file. {pdfHandlers.pdfError}</p>}
        >
          <Page
            pageNumber={1}
            onLoadSuccess={pdfHandlers.onPageLoadSuccess}
            width={floorPlanState.pageDimensions.width}
            height={floorPlanState.pageDimensions.height}
            canvasRef={null}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        {floorPlanState.pageDimensions.width > 0 && (
          <SvgOverlay
            svgRef={svgRef}
            pageDimensions={floorPlanState.pageDimensions}
            units={units}
            statusVisibility={floorPlanState.statusVisibility}
            statusColors={floorPlanState.statusColors}
            isEditMode={floorPlanState.isEditMode}
            isLocked={floorPlanState.isLocked}
            drawingPolygon={floorPlanState.drawingPolygon}
            highlightedUnitId={highlightedUnitId}
            onUnitClick={onUnitClick}
            onPointMouseDown={pdfHandlers.handlePointMouseDown}
            onSvgClick={pdfHandlers.handleSvgClick}
            onMouseMove={pdfHandlers.handleMouseMove}
          />
        )}
      </div>
    </div>
  );
}


'use client';

import React from 'react';
import { useFloorPlanState } from './hooks/useFloorPlanState';
import { Toolbar } from './Toolbar';
import { InfoPanel } from './InfoPanel';
import { StatusFilter } from './StatusFilter';
import { PdfCanvas } from './PdfCanvas';
import { Unit } from './FloorPlanViewer';

export interface Unit {
  id: string;
  identifier: string;
  name: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος' | 'Προς Ενοικίαση';
  polygonPoints?: { x: number; y: number }[];
}

interface FloorPlanViewerProps {
  pdfUrl: string;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  onUnitClick: (unitId: string) => void;
  onUnitDelete: (unitId: string) => void;
  onPolygonDrawn: (points: { x: number; y: number }[]) => void;
  onUnitPointsUpdate: (unitId: string, newPoints: { x: number; y: number }[]) => void;
}

export function FloorPlanViewer(props: FloorPlanViewerProps) {
  const {
    pdfUrl,
    units,
    setUnits,
    onPolygonDrawn,
    onUnitPointsUpdate,
    onUnitClick,
    onUnitDelete,
  } = props;

  const {
    pageDimensions,
    setPageDimensions,
    statusVisibility,
    handleStatusVisibilityChange,
    isLocked,
    setIsLocked,
    isEditMode,
    toggleEditMode,
    draggingPoint,
    setDraggingPoint,
    drawingPolygon,
    setDrawingPolygon,
    completeAndResetDrawing,
    handleUndo,
    isPrecisionZooming,
    lastMouseEvent,
    zoom,
    pdfContainerRef,
  } = useFloorPlanState({ onPolygonDrawn });

  return (
    <div className="flex flex-col items-center gap-2">
      <PdfCanvas
        pdfUrl={pdfUrl}
        units={units}
        setUnits={setUnits}
        statusVisibility={statusVisibility}
        isLocked={isLocked}
        isEditMode={isEditMode}
        drawingPolygon={drawingPolygon}
        draggingPoint={draggingPoint}
        lastMouseEvent={lastMouseEvent}
        isPrecisionZooming={isPrecisionZooming}
        pageDimensions={pageDimensions}
        pdfContainerRef={pdfContainerRef}
        zoom={zoom}
        setPageDimensions={setPageDimensions}
        setDrawingPolygon={setDrawingPolygon}
        setDraggingPoint={setDraggingPoint}
        onUnitPointsUpdate={onUnitPointsUpdate}
        onUnitClick={onUnitClick}
        onUnitDelete={onUnitDelete}
      />

      <div className="flex w-full flex-col items-center gap-2">
        <Toolbar
          numPages={1} // Assuming single page PDFs for now
          isLocked={isLocked}
          isEditMode={isEditMode}
          drawingPolygon={drawingPolygon}
          scale={zoom.scale}
          rotation={zoom.rotation}
          zoomInput={zoom.zoomInput}
          setScale={zoom.setScale}
          setRotation={zoom.setRotation}
          setIsLocked={setIsLocked}
          toggleEditMode={toggleEditMode}
          handleUndo={handleUndo}
          completeAndResetDrawing={completeAndResetDrawing}
          handleFitToView={zoom.handleFitToView}
          setZoomInput={zoom.setZoomInput}
          handleZoomInputChange={zoom.handleZoomInputChange}
          handleZoomInputBlur={zoom.handleZoomInputBlur}
          handleZoomInputKeyDown={zoom.handleZoomInputKeyDown}
        />

        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          <InfoPanel
            isEditMode={isEditMode}
            isLocked={isLocked}
            isPrecisionZooming={isPrecisionZooming}
          />
          <StatusFilter
            statusVisibility={statusVisibility}
            onVisibilityChange={handleStatusVisibilityChange}
          />
        </div>
      </div>
    </div>
  );
}

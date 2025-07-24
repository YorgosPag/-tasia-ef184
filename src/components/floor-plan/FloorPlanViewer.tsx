
'use client';

import React from 'react';
import { useFloorPlanState } from './hooks/useFloorPlanState';
import { useFloorPlanDataManager } from './hooks/useFloorPlanDataManager';
import { Toolbar } from './Toolbar';
import { InfoPanel } from './InfoPanel';
import { StatusFilter } from './StatusFilter';
import { PdfCanvas } from './PdfCanvas';
import { UnitsListTable } from '../floors/UnitsListTable';
import { UnitDialogForm, unitSchema } from '../units/UnitDialogForm';

export interface Unit {
  id: string;
  identifier: string;
  name: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος' | 'Προς Ενοικίαση';
  polygonPoints?: { x: number; y: number }[];
  floorId: string;
  originalId: string;
  projectId?: string;
}

interface FloorPlanViewerProps {
  floorId: string;
  pdfUrl: string;
  initialUnits: Unit[];
  onUnitSelect: (unitId: string) => void;
}

export function FloorPlanViewer(props: FloorPlanViewerProps) {
  const { floorId, pdfUrl, initialUnits, onUnitSelect } = props;

  const {
    units,
    form,
    isSubmitting,
    handleDeleteUnit,
    handleDuplicateUnit,
    onSubmitUnit,
    editingUnit,
    drawingPolygon,
    isDialogOpen,
    setIsDialogOpen,
    setDrawingPolygon,
    setEditingUnit,
    handleUnitPointsUpdate,
    unitsWithoutPolygon,
    highlightedUnitId,
    setHighlightedUnitId,
  } = useFloorPlanDataManager({ floorId, initialUnits });

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
    localDrawingPolygon,
    setLocalDrawingPolygon,
    completeAndResetDrawing,
    handleUndo,
    isPrecisionZooming,
    lastMouseEvent,
    zoom,
    pdfContainerRef,
  } = useFloorPlanState({ onPolygonDrawn: setDrawingPolygon });

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setDrawingPolygon(null);
      setEditingUnit(null);
      form.reset({
        identifier: '', name: '', type: '', status: 'Διαθέσιμο', polygonPoints: '',
        existingUnitId: 'new',
        area: '', price: '', bedrooms: '', bathrooms: '', orientation: '', amenities: '',
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <PdfCanvas
        pdfUrl={pdfUrl}
        units={units}
        statusVisibility={statusVisibility}
        isLocked={isLocked}
        isEditMode={isEditMode}
        drawingPolygon={localDrawingPolygon}
        draggingPoint={draggingPoint}
        lastMouseEvent={lastMouseEvent}
        isPrecisionZooming={isPrecisionZooming}
        pageDimensions={pageDimensions}
        pdfContainerRef={pdfContainerRef}
        zoom={zoom}
        setPageDimensions={setPageDimensions}
        setDrawingPolygon={setLocalDrawingPolygon}
        setDraggingPoint={setDraggingPoint}
        onUnitPointsUpdate={handleUnitPointsUpdate}
        onUnitClick={(id) => onUnitSelect(id)}
        onUnitDelete={handleDeleteUnit}
        highlightedUnitId={highlightedUnitId}
        setHighlightedUnitId={setHighlightedUnitId}
      />

      <div className="w-full space-y-2">
        <Toolbar
          numPages={1}
          isLocked={isLocked}
          isEditMode={isEditMode}
          drawingPolygon={localDrawingPolygon}
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

      <UnitsListTable
        units={units}
        isLoading={false} // Loading is handled by the container now
        onAddNewUnit={() => setIsDialogOpen(true)}
        onEditUnit={(unit) => onUnitSelect(unit.id)}
        onDeleteUnit={handleDeleteUnit}
        onDuplicateUnit={handleDuplicateUnit}
        highlightedUnitId={highlightedUnitId}
        setHighlightedUnitId={setHighlightedUnitId}
      />

       <UnitDialogForm
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={form.handleSubmit(onSubmitUnit)}
        form={form}
        isSubmitting={isSubmitting}
        editingUnit={editingUnit}
        drawingPolygon={drawingPolygon}
        availableUnits={unitsWithoutPolygon}
      />
    </div>
  );
}

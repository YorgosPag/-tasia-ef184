
'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalStorageState } from '@/shared/hooks/use-local-storage-state';
import { usePolygonDraw } from './usePolygonDraw';
import { useZoom } from './useZoom';
import { usePrecisionZoom } from './usePrecisionZoom';
import { Unit } from '@/tasia/components/floor-plan/Unit';
import { ALL_STATUSES, STATUS_COLOR_MAP } from '@/tasia/components/floor-plan/utils';

interface PageDimensions {
    width: number;
    height: number;
    cropBox: { x: number; y: number; width: number; height: number };
}

interface useFloorPlanStateProps {
    onPolygonDrawn: (points: { x: number; y: number }[]) => void;
}

/**
 * useFloorPlanState
 * Orchestrator hook that combines all interaction state for the floor plan viewer.
 * It manages the composition of more specialized hooks for zoom, drawing, and UI state.
 * This is the primary hook consumed by the FloorPlanViewer component.
 */
export function useFloorPlanState({ onPolygonDrawn }: useFloorPlanStateProps) {
    const [pageDimensions, setPageDimensions] = useState<PageDimensions>({
        width: 0, height: 0, cropBox: { x: 0, y: 0, width: 0, height: 0 }
    });
    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const lastMouseEvent = useRef<MouseEvent | null>(null);

    const [isLocked, setIsLocked] = useLocalStorageState('floorPlanLocked', true);
    const [statusVisibility, setStatusVisibility] = useLocalStorageState(
        'floorPlanStatusVisibility',
        ALL_STATUSES.reduce((acc, status) => ({ ...acc, [status]: true }), {} as Record<Unit['status'], boolean>)
    );
     const [statusColors, setStatusColors] = useLocalStorageState(
        'floorPlanStatusColors',
        STATUS_COLOR_MAP
    );

    const [isEditMode, setIsEditMode] = useState(false);
    const [draggingPoint, setDraggingPoint] = useState<{ unitId: string; pointIndex: number } | null>(null);
    
    const {
        drawingPolygon,
        setDrawingPolygon,
        handleUndo,
        completeAndResetDrawing,
        cancelDrawing,
    } = usePolygonDraw({ isEditMode, onPolygonDrawn });

    const zoom = useZoom({ pdfContainerRef, pageDimensions, isPrecisionZooming: false });
    
    const isPrecisionZooming = usePrecisionZoom({
        isEditMode,
        lastMouseEvent,
        pdfContainerRef,
        currentScale: zoom.scale,
        setScale: zoom.setScale,
    });
    
    // Effect to update the last mouse position, used by precision zoom
    useEffect(() => {
        const pdfContainer = pdfContainerRef.current;
        const updateMousePosition = (e: MouseEvent) => {
            if(lastMouseEvent) {
                lastMouseEvent.current = e;
            }
        };
        pdfContainer?.addEventListener('mousemove', updateMousePosition);
        return () => pdfContainer?.removeEventListener('mousemove', updateMousePosition);
    }, [pdfContainerRef, lastMouseEvent]);


    const handleStatusVisibilityChange = (status: Unit['status'], checked: boolean) => {
        setStatusVisibility(prev => ({ ...prev, [status]: checked }));
    }

    const handleColorChange = (status: Unit['status'], color: string) => {
        setStatusColors(prev => ({ ...prev, [status]: color }));
    };

    const handleReset = () => {
        setStatusVisibility(ALL_STATUSES.reduce((acc, status) => ({ ...acc, [status]: true }), {} as Record<Unit['status'], boolean>));
        setStatusColors(STATUS_COLOR_MAP);
    };

    const toggleEditMode = () => {
        setIsEditMode(prev => {
            const isEnteringEditMode = !prev;
            // If exiting edit mode with an unfinished polygon, cancel it.
            if (!isEnteringEditMode && drawingPolygon.length > 0) {
                 cancelDrawing();
            }
            return isEnteringEditMode;
        });
    }

    return {
        pageDimensions,
        setPageDimensions,
        statusVisibility,
        handleStatusVisibilityChange,
        statusColors,
        handleColorChange,
        handleReset,
        isLocked,
        setIsLocked,
        isEditMode,
        toggleEditMode,
        draggingPoint,
        setDraggingPoint,
        drawingPolygon,
        setDrawingPolygon,
        handleUndo,
        completeAndResetDrawing,
        isPrecisionZooming,
        lastMouseEvent,
        zoom,
        pdfContainerRef,
    };
}

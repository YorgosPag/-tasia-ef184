
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import { usePolygonDraw } from './usePolygonDraw';
import { useZoom } from './useZoom';
import { Unit } from '../FloorPlanViewer';
import { ALL_STATUSES } from '../utils';

interface PageDimensions {
    width: number;
    height: number;
    cropBox: { x: number; y: number; width: number; height: number };
}

interface useFloorPlanStateProps {
    units: Unit[];
    onPolygonDrawn: (points: { x: number; y: number }[]) => void;
}

export function useFloorPlanState({ units, onPolygonDrawn }: useFloorPlanStateProps) {
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [localUnits, setLocalUnits] = useState<Unit[]>(units);
    const [draggingPoint, setDraggingPoint] = useState<{ unitId: string; pointIndex: number } | null>(null);
    const [isPrecisionZooming, setIsPrecisionZooming] = useState(false);
    
    const preZoomState = useRef({ scale: 1.0, scrollLeft: 0, scrollTop: 0 });

    const {
        drawingPolygon,
        setDrawingPolygon,
        handleUndo,
        completeAndResetDrawing
    } = usePolygonDraw({ isEditMode, onPolygonDrawn });

    const zoom = useZoom({ pdfContainerRef, pageDimensions, isPrecisionZooming });

    useEffect(() => {
        setLocalUnits(units);
    }, [units]);
    
    useEffect(() => {
        const pdfContainer = pdfContainerRef.current;
        if (!pdfContainer) return;
    
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || !isEditMode) {
              return;
          }
          if (e.key === 'Shift' && !isPrecisionZooming && lastMouseEvent.current) {
            e.preventDefault();
            setIsPrecisionZooming(true);
    
            preZoomState.current = {
                scale: zoom.scale,
                scrollLeft: pdfContainer.scrollLeft,
                scrollTop: pdfContainer.scrollTop,
            };
            
            const rect = pdfContainer.getBoundingClientRect();
            const mouseX = lastMouseEvent.current.clientX - rect.left;
            const mouseY = lastMouseEvent.current.clientY - rect.top;
    
            const newScale = 2.5;
            
            const pointX = (preZoomState.current.scrollLeft + mouseX) / preZoomState.current.scale;
            const pointY = (preZoomState.current.scrollTop + mouseY) / preZoomState.current.scale;
    
            zoom.setScale(newScale);
    
            setTimeout(() => {
                if(pdfContainerRef.current){
                    const newScrollLeft = (pointX * newScale) - (pdfContainerRef.current.clientWidth / 2);
                    const newScrollTop = (pointY * newScale) - (pdfContainerRef.current.clientHeight / 2);
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
            zoom.setScale(preZoomState.current.scale);
            
            setTimeout(() => {
                if (pdfContainerRef.current) {
                  pdfContainerRef.current.scrollLeft = preZoomState.current.scrollLeft;
                  pdfContainerRef.current.scrollTop = preZoomState.current.scrollTop;
                }
            }, 0);
          }
        };
        
        const updateMousePosition = (e: MouseEvent) => {
            lastMouseEvent.current = e;
        };
    
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        pdfContainer.addEventListener('mousemove', updateMousePosition);
    
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
          if (pdfContainer) {
            pdfContainer.removeEventListener('mousemove', updateMousePosition);
          }
        };
      }, [isEditMode, isPrecisionZooming, zoom, pdfContainerRef]);

    const handleStatusVisibilityChange = (status: Unit['status'], checked: boolean) => {
        setStatusVisibility(prev => ({ ...prev, [status]: checked }));
    }

    const toggleEditMode = () => {
        setIsEditMode(prev => {
            if (!prev && drawingPolygon.length > 0) {
                 setDrawingPolygon([]);
            }
            return !prev;
        });
    }

    return {
        pageDimensions,
        setPageDimensions,
        statusVisibility,
        handleStatusVisibilityChange,
        isLocked,
        setIsLocked,
        isEditMode,
        toggleEditMode,
        localUnits,
        setLocalUnits,
        draggingPoint,
        setDraggingPoint,
        drawingPolygon,
        setDrawingPolygon,
        handleUndo,
        completeAndResetDrawing,
        isPrecisionZooming,
        setIsPrecisionZooming,
        lastMouseEvent,
        zoom,
        pdfContainerRef,
    };
}

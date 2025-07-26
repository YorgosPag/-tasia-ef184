
'use client';
import { useCallback, useEffect } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { useLocalStorageState } from '@/shared/hooks/use-local-storage-state';
import { useParams } from 'next/navigation';

interface Point {
  x: number;
  y: number;
}

interface UsePolygonDrawProps {
  isEditMode: boolean;
  onPolygonDrawn: (points: Point[]) => void;
}

/**
 * usePolygonDraw
 * A hook to manage the state and logic for drawing a new polygon.
 * It handles adding points, undoing, and completing the drawing.
 * It also persists the in-progress drawing to localStorage to prevent data loss.
 */
export function usePolygonDraw({ isEditMode, onPolygonDrawn }: UsePolygonDrawProps) {
  const params = useParams();
  const floorId = params.id as string;
  const storageKey = `drawingPolygon_${floorId}`;

  const [drawingPolygon, setDrawingPolygon] = useLocalStorageState<Point[]>(storageKey, []);
  const { toast } = useToast();

  const handleUndo = useCallback(() => {
    setDrawingPolygon((prev) => prev.slice(0, -1));
  }, [setDrawingPolygon]);

  const completeAndResetDrawing = useCallback(() => {
    if (drawingPolygon.length > 2) {
      onPolygonDrawn(drawingPolygon);
    }
    setDrawingPolygon([]); // This will also clear localStorage
  }, [drawingPolygon, onPolygonDrawn, setDrawingPolygon]);
  
  const cancelDrawing = useCallback(() => {
    setDrawingPolygon([]); // Clear state and localStorage
    toast({
      title: 'Η σχεδίαση ακυρώθηκε',
      description: 'Μπορείτε να ξεκινήσετε ένα νέο σχήμα.',
    });
  }, [setDrawingPolygon, toast]);

  // Effect for handling keyboard shortcuts during drawing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return; // Ignore key events if an input is focused
      }
      
      // Cancel drawing with Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelDrawing();
      }
      
      // Undo last point with Ctrl/Cmd+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, handleUndo, cancelDrawing]);

  // Cleanup effect when the component unmounts or floorId changes.
  // This is a safeguard against leaving orphaned data in localStorage.
  useEffect(() => {
    return () => {
      // When the component unmounts, we assume any in-progress drawing is abandoned.
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
    };
  }, [storageKey]);

  return {
    drawingPolygon,
    setDrawingPolygon,
    handleUndo,
    completeAndResetDrawing,
    cancelDrawing,
  };
}

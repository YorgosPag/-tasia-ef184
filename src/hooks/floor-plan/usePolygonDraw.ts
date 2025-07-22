
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
 */
export function usePolygonDraw({ isEditMode, onPolygonDrawn }: UsePolygonDrawProps) {
  const [drawingPolygon, setDrawingPolygon] = useState<Point[]>([]);
  const { toast } = useToast();

  const handleUndo = useCallback(() => {
    setDrawingPolygon((prev) => prev.slice(0, -1));
  }, []);

  const completeAndResetDrawing = useCallback(() => {
    if (drawingPolygon.length > 2) {
      onPolygonDrawn(drawingPolygon);
    }
    setDrawingPolygon([]);
  }, [drawingPolygon, onPolygonDrawn]);

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
        setDrawingPolygon([]);
        toast({
          title: 'Η σχεδίαση ακυρώθηκε',
          description: 'Μπορείτε να ξεκινήσετε ένα νέο σχήμα.',
        });
      }
      
      // Undo last point with Ctrl/Cmd+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, handleUndo, toast]);

  return {
    drawingPolygon,
    setDrawingPolygon,
    handleUndo,
    completeAndResetDrawing,
  };
}

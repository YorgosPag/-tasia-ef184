
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UsePolygonDrawProps {
  isEditMode: boolean;
  onPolygonDrawn: (points: { x: number; y: number }[]) => void;
}

export function usePolygonDraw({ isEditMode, onPolygonDrawn }: UsePolygonDrawProps) {
  const [drawingPolygon, setDrawingPolygon] = useState<{ x: number; y: number }[]>([]);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setDrawingPolygon([]);
        toast({
          title: 'Η σχεδίαση ακυρώθηκε',
          description: 'Μπορείτε να ξεκινήσετε ένα νέο σχήμα.',
        });
      }
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

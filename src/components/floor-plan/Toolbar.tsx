
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Minus,
  Plus,
  Frame,
  RotateCw,
  Lock,
  Unlock,
  Pencil,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  numPages: number | null;
  isLocked: boolean;
  isEditMode: boolean;
  drawingPolygon: { x: number; y: number }[];
  scale: number;
  rotation: number;
  zoomInput: string;
  setScale: (value: React.SetStateAction<number>) => void;
  setRotation: (value: React.SetStateAction<number>) => void;
  setIsLocked: (value: React.SetStateAction<boolean>) => void;
  toggleEditMode: () => void;
  handleUndo: () => void;
  completeAndResetDrawing: () => void;
  handleFitToView: () => void;
  setZoomInput: (value: string) => void;
  handleZoomInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleZoomInputBlur: () => void;
  handleZoomInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Toolbar({
  numPages,
  isLocked,
  isEditMode,
  drawingPolygon,
  scale,
  rotation,
  zoomInput,
  setScale,
  setRotation,
  setIsLocked,
  toggleEditMode,
  handleUndo,
  completeAndResetDrawing,
  handleFitToView,
  setZoomInput,
  handleZoomInputChange,
  handleZoomInputBlur,
  handleZoomInputKeyDown,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-md bg-muted p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setScale((s) => Math.max(0.1, s - 0.1))}
        disabled={!numPages || isLocked}
      >
        <Minus />
      </Button>
      <Input
        value={zoomInput}
        onChange={handleZoomInputChange}
        onBlur={handleZoomInputBlur}
        onKeyDown={handleZoomInputKeyDown}
        className="h-8 w-20 text-center"
        disabled={!numPages || isLocked}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setScale((s) => Math.min(10, s + 0.1))}
        disabled={!numPages || isLocked}
      >
        <Plus />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFitToView}
        disabled={!numPages || isLocked}
        title="Προσαρμογή στην οθόνη"
      >
        <Frame />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setRotation((r) => (r + 90) % 360)}
        disabled={!numPages || isLocked}
      >
        <RotateCw />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsLocked((prev) => !prev)}
        disabled={!numPages}
      >
        {isLocked ? <Lock className="text-primary" /> : <Unlock />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleEditMode}
        disabled={!numPages || isLocked}
        title="Λειτουργία Σχεδίασης"
      >
        <Pencil className={cn(isEditMode && 'text-primary')} />
      </Button>
      {isEditMode && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={drawingPolygon.length === 0}
            title="Αναίρεση"
          >
            <Undo2 />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={completeAndResetDrawing}
            disabled={drawingPolygon.length < 3}
          >
            Ολοκλήρωση Πολυγώνου
          </Button>
        </>
      )}
    </div>
  );
}

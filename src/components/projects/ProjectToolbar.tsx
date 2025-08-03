'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Minus, Plus, Save, FileText, RefreshCw, Download, Upload } from "lucide-react";
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

function ToolbarButton({ tooltip, children, onClick, className, disabled }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", className)} 
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface ProjectToolbarProps {
  selectedProject?: any;
  onNew?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

export function ProjectToolbar({
  selectedProject,
  onNew,
  onEdit,
  onDelete,
  onSave,
  onRefresh,
  onExport,
  onImport
}: ProjectToolbarProps) {
  return (
    <TooltipProvider>
      <div className="px-2 py-1.5 border-b bg-muted/30 flex items-center gap-1">
        <ToolbarButton 
          tooltip="Νέο Έργο" 
          className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
          onClick={onNew}
        >
          <Plus className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton 
          tooltip="Επεξεργασία Έργου" 
          className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
          onClick={onEdit}
          disabled={!selectedProject}
        >
          <FileText className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton 
          tooltip="Διαγραφή Έργου" 
          className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
          onClick={onDelete}
          disabled={!selectedProject}
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton 
          tooltip="Αποθήκευση Αλλαγών"
          onClick={onSave}
        >
          <Save className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton 
          tooltip="Ανανέωση Δεδομένων"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton 
          tooltip="Εξαγωγή Δεδομένων"
          onClick={onExport}
        >
          <Download className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton 
          tooltip="Εισαγωγή Δεδομένων"
          onClick={onImport}
        >
          <Upload className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="flex-1" />
        
        <ToolbarButton 
          tooltip="Βοήθεια"
        >
          <HelpCircle className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
}
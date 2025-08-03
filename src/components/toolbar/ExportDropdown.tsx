'use client';

import React from "react";
import { ToolbarButton } from "./ToolbarButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, BarChart3, Calendar } from "lucide-react";

interface ExportDropdownProps {
  onExport: (format: "excel" | "pdf" | "dashboard" | "schedule") => void;
}

export function ExportDropdown({ onExport }: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ToolbarButton tooltip="Εξαγωγή Δεδομένων">
            <Download className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Εξαγωγή σε:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onExport("excel")}>
          <FileText className="w-4 h-4 mr-2" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("pdf")}>
          <FileText className="w-4 h-4 mr-2" />
          PDF Αναφορά
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("dashboard")}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Στατιστικά Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("schedule")}>
          <Calendar className="w-4 h-4 mr-2" />
          Χρονοδιάγραμμα
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

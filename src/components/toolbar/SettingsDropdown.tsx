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
import { Settings, Eye, Save, RefreshCw, HelpCircle } from "lucide-react";

export function SettingsDropdown() {
  return (
    <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                <ToolbarButton tooltip="Ρυθμίσεις Προβολής">
                    <Settings className="w-4 h-4" />
                </ToolbarButton>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Ρυθμίσεις</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Προσαρμογή Στηλών
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Save className="w-4 h-4 mr-2" />
                Αποθήκευση Προβολής
                </DropdownMenuItem>
                <DropdownMenuItem>
                <RefreshCw className="w-4 h-4 mr-2" />
                Επαναφορά Προεπιλογών
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Προτιμήσεις Χρήστη
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <ToolbarButton 
            tooltip="Βοήθεια και Οδηγίες (F1)"
        >
            <HelpCircle className="w-4 h-4" />
        </ToolbarButton>
    </>
  );
}

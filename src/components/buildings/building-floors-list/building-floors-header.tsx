"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface BuildingFloorsHeaderProps {
  isEditor: boolean;
  onAddNew: () => void;
}

export function BuildingFloorsHeader({ isEditor, onAddNew }: BuildingFloorsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle>Όροφοι του Κτιρίου</CardTitle>
      {isEditor && (
        <Button size="sm" onClick={onAddNew}>
          <PlusCircle className="mr-2" />
          Νέος Όροφος
        </Button>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit3 } from "lucide-react";

interface EditModeToggleProps {
  isEditor: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export function EditModeToggle({
  isEditor,
  isEditMode,
  toggleEditMode,
}: EditModeToggleProps) {
  if (!isEditor) {
    return null;
  }

  return (
    <Button
      onClick={toggleEditMode}
      variant={isEditMode ? "default" : "outline"}
      size="sm"
    >
      {isEditMode ? (
        <>
          <Eye className="mr-2 h-4 w-4" />
          Προβολή
        </>
      ) : (
        <>
          <Edit3 className="mr-2 h-4 w-4" />
          Επεξεργασία
        </>
      )}
    </Button>
  );
}

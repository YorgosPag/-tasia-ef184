"use client";

import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

interface WorkStagesEmptyStateProps {
  onAddNewStage: () => void;
}

export function WorkStagesEmptyState({
  onAddNewStage,
}: WorkStagesEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Construction className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">
        Δεν υπάρχουν ακόμα στάδια εργασίας
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Ξεκίνα προσθέτοντας το πρώτο στάδιο για να οργανώσεις το έργο σου.
      </p>
      <div className="mt-6">
        <Button onClick={onAddNewStage}>Προσθήκη Πρώτου Σταδίου</Button>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit3 } from "lucide-react";

export function PropertyActionsSection() {
    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-3 w-3 mr-1" />
                Προβολή
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
                <Edit3 className="h-3 w-3 mr-1" />
                Επεξ.
            </Button>
        </div>
    );
}
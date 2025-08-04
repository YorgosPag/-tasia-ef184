"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PropertyDetailsPanel } from "./PropertyDetailsPanel";
import { PropertyHoverInfo } from "./PropertyHoverInfo";

interface PropertyInspectorPanelProps {
    selectedProperty: string | null;
    hoveredProperty: string | null;
}

export function PropertyInspectorPanel({
    selectedProperty,
    hoveredProperty,
}: PropertyInspectorPanelProps) {
    return (
        <div className="col-span-2 flex flex-col gap-4">
            {/* Selected Property Details - Top Half */}
            <div className="flex-1">
                <Card className="h-full">
                    <CardHeader className="pb-3">
                        <h3 className="text-sm font-semibold">Επιλεγμένο Ακίνητο</h3>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <PropertyDetailsPanel propertyId={selectedProperty} />
                    </CardContent>
                </Card>
            </div>

            {/* Hovered Property Info - Bottom Half */}
            <div className="flex-1">
                <Card className="h-full">
                    <CardHeader className="pb-3">
                        <h3 className="text-sm font-semibold">Στοιχεία Hover</h3>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <PropertyHoverInfo propertyId={hoveredProperty} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

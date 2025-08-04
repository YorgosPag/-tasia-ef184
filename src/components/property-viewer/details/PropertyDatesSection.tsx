"use client";

import { Calendar } from "lucide-react";
import type { PropertyDetails } from "./types";

export function PropertyDatesSection({ dates }: { dates: PropertyDetails['dates'] }) {
    return (
        <div className="space-y-1">
            <h4 className="text-xs font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Ημερομηνίες
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground">
                <div>Δημιουργία: {new Date(dates.created).toLocaleDateString('el-GR')}</div>
                <div>Ενημέρωση: {new Date(dates.updated).toLocaleDateString('el-GR')}</div>
                {dates.available && (
                    <div>Διαθεσιμότητα: {new Date(dates.available).toLocaleDateString('el-GR')}</div>
                )}
            </div>
        </div>
    );
}
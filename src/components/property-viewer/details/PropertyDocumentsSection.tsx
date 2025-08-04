"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
import type { PropertyDetails } from "./types";

export function PropertyDocumentsSection({ documents }: { documents: PropertyDetails['documents'] }) {
    return (
        <div className="space-y-2">
            <h4 className="text-xs font-medium flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Έγγραφα
            </h4>
            <div className="space-y-1">
                {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{doc.name}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                           <a href={doc.url} target="_blank" rel="noopener noreferrer">
                             <ExternalLink className="h-3 w-3" />
                           </a>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
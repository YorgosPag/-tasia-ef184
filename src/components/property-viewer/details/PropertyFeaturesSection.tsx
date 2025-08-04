"use client";

import { Badge } from "@/components/ui/badge";

export function PropertyFeaturesSection({ features }: { features: string[] }) {
    return (
        <div className="space-y-2">
            <h4 className="text-xs font-medium">Χαρακτηριστικά</h4>
            <div className="flex flex-wrap gap-1">
                {features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
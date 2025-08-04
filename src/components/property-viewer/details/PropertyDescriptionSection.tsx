"use client";

export function PropertyDescriptionSection({ description }: { description: string }) {
    return (
        <div className="space-y-1">
            <h4 className="text-xs font-medium">Περιγραφή</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    );
}
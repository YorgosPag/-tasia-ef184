"use client";

export function HoverQuickInfoSection({ quickInfo }: { quickInfo: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">Σύντομη περιγραφή:</p>
      <p className="text-xs leading-relaxed">{quickInfo}</p>
    </div>
  );
}

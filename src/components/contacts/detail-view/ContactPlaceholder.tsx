"use client";

export function ContactPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <p className="text-muted-foreground">Επιλέξτε μια επαφή από τη λίστα</p>
        <p className="text-sm text-muted-foreground">
          για να δείτε τις λεπτομέρειες.
        </p>
      </div>
    </div>
  );
}

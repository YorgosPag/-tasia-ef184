
import { ReactNode } from 'react';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] gap-4">
        {children}
    </div>
  );
}

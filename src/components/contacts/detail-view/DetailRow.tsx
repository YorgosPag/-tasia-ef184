
'use client';

import { Badge } from '@/shared/components/ui/badge';

export const DetailRow = ({ label, value, href, type, children }: { label: string; value?: string | null; href?: string, type?: string, children?: React.ReactNode }) => {
  if (!value && !children) return null; // Don't render empty rows

  const content = href && value ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{value}</a>
  ) : (
    <span>{value}</span>
  );

  return (
    <div className="grid grid-cols-3 gap-2 text-sm items-center">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
            {children || content}
        </div>
        {type && <Badge variant="outline" className="text-xs whitespace-nowrap">{type}</Badge>}
        </dd>
    </div>
  );
};

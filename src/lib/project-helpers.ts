
'use client';

import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Company } from '@/hooks/use-data-store';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import React from 'react';

export const formatDate = (timestamp: Timestamp | Date | undefined) => {
  if (!timestamp) return 'N/A';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return format(date, 'dd/MM/yyyy', { locale: el });
};

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Ολοκληρωμένο':
      return 'default';
    case 'Σε εξέλιξη':
      return 'secondary';
    case 'Ενεργό':
      return 'outline';
    default:
      return 'outline';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Ολοκληρωμένο':
      return '✅ Ολοκληρωμένο';
    case 'Σε εξέλιξη':
      return '🚧 Σε εξέλιξη';
    case 'Ενεργό':
      return '🔥 Ενεργό';
    default:
      return status;
  }
};


export const getPhaseStatusBadge = (
    status: 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Εκκρεμεί' | 'Καθυστερεί' | undefined,
    currentPhaseName: string | undefined,
    deadline: Timestamp | Date
) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = 'outline';
    let label = 'Προπώληση';

    switch(status) {
        case 'Σε εξέλιξη':
            variant = 'secondary';
            label = 'Σε κατασκευή';
            break;
        case 'Καθυστερεί':
            variant = 'destructive';
            label = 'Σε καθυστέρηση';
            break;
        case 'Ολοκληρώθηκε':
            variant = 'default';
            label = 'Ολοκληρωμένο';
            break;
        case 'Εκκρεμεί':
        default:
            variant = 'outline';
            label = 'Προπώληση';
            break;
    }
    
    const summary = `Τρέχουσα φάση: ${currentPhaseName || 'N/A'}. Εκτιμ. ολοκλήρωση: ${formatDate(deadline)}`;

    return (
        <div className="flex items-center gap-2">
            <Badge variant={variant}>{label}</Badge>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help"/>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{summary}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}


export const getCompanyName = (companyId: string, companies: Company[]) => {
  return companies.find((c) => c.id === companyId)?.name || companyId;
};

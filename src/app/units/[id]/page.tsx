
'use client';

import { useUnitDetails } from '@/hooks/use-unit-details';
import { UnitDetailsPageView } from '@/components/units/UnitDetailsPageView';
import { Loader2 } from 'lucide-react';

export default function UnitDetailsPage() {
  const viewProps = useUnitDetails();

  if (viewProps.isLoading || !viewProps.unit) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }
  
  return <UnitDetailsPageView {...viewProps} />;
}

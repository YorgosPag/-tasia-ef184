

'use client';

import React from 'react';
import { useUnitDetails } from '@/tasia/hooks/use-unit-details';
import { UnitDetailsPageView } from '@/tasia/components/units/UnitDetailsPageView';
import { Loader2 } from 'lucide-react';

export default function UnitDetailsPage() {
  const pageProps = useUnitDetails();

  if (pageProps.isLoading || !pageProps.unit) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  return <UnitDetailsPageView {...pageProps} />;
}

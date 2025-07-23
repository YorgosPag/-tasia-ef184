
'use client';

import { useUnitDetails } from '@/hooks/use-unit-details';
import { UnitDetailsPageView } from '@/components/units/UnitDetailsPageView';

export default function UnitDetailsPage() {
  const viewProps = useUnitDetails();

  if (viewProps.isLoading || !viewProps.unit) {
    return <div className="flex justify-center items-center h-full">{viewProps.loader}</div>;
  }
  
  return <UnitDetailsPageView {...viewProps} />;
}

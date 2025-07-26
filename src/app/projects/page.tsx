
'use client';

import React from 'react';
import { useProjectsPage } from '@/tasia/hooks/use-projects-page';
import { ProjectsPageView } from '@/tasia/components/projects/ProjectsPageView';
import { Loader2 } from 'lucide-react';

export default function ProjectsPage() {
  const pageProps = useProjectsPage();
  const { isLoading } = pageProps;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return <ProjectsPageView {...pageProps} />;
}

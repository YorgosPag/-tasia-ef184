'use client';

import React from 'react';
import { ProjectsPageContent } from '@/components/projects/ProjectsPageView';
import { useProjectsPage } from '@/hooks/use-projects-page';

export default function ProjectsPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageContent {...projectsPageProps} />;
}

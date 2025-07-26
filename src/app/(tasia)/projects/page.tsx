
'use client';

import React from 'react';
import { useProjectsPage } from '@/app/(tasia)/hooks/use-projects-page';
import { ProjectsPageView } from '@/app/(tasia)/components/projects/ProjectsPageView';


export default function ProjectsPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageView {...projectsPageProps} />;
}

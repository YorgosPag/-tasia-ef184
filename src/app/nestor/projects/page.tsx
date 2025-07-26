
'use client';

import { useProjectsPage } from '@/tasia/hooks/use-projects-page';
import { ProjectsPageView } from '@/tasia/components/projects/ProjectsPageView';

export default function NestorProjectsPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageView {...projectsPageProps} />;
}

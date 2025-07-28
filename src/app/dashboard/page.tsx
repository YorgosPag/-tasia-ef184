
'use client';

import { useProjectsPage } from '@/shared/hooks/use-projects-page';
import { ProjectsPageView } from '@/components/projects/ProjectsPageView';

export default function DashboardPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageView {...projectsPageProps} />;
}

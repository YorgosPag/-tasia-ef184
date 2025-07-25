
'use client';

import { ProjectsPageView } from '@/components/projects/ProjectsPageView';
import { useProjectsPage } from '@/hooks/use-projects-page';

export default function ProjectsPage() {
  const props = useProjectsPage();
  return <ProjectsPageView {...props} />;
}

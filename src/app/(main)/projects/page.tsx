"use client";

import { useProjectsPage } from "@/hooks/use-projects-page";
import { ProjectsPageView } from "@/components/projects/ProjectsPageView";

export default function ProjectsPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageView {...projectsPageProps} />;
}

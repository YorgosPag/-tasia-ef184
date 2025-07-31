"use client";

import { useProjectsPage } from "@/hooks/use-projects-page";
import { ProjectTableSkeleton } from "@/components/projects/ProjectTableSkeleton";
import dynamic from "next/dynamic";

const ProjectsPageView = dynamic(
  () =>
    import("@/components/projects/ProjectsPageView").then(
      (mod) => mod.ProjectsPageView,
    ),
  {
    loading: () => <ProjectTableSkeleton />,
    ssr: false,
  },
);

export default function ProjectsPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageView {...projectsPageProps} />;
}

"use client";

import React from "react";
import { ProjectsPageView } from "@/components/projects/ProjectsPageView";
import { useProjectsPage } from "@/hooks/use-projects-page";

export default function ProjectsPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageView {...projectsPageProps} />;
}

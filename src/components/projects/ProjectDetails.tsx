"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
}

interface ProjectDetailsProps {
  project: Project | null;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select a project to see the details.</p>
      </div>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>Project ID: {project.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for project {project.name} will be shown here.</p>
      </CardContent>
    </Card>
  );
}

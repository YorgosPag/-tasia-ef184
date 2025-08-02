
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
}

interface ProjectsListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
}

export function ProjectsList({ projects, selectedProject, onSelectProject }: ProjectsListProps) {
  return (
    <Card className="w-64 flex-shrink-0">
      <CardHeader>
        <CardTitle>Έργα</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Button
                variant={selectedProject?.id === project.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectProject(project)}
              >
                {project.name}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

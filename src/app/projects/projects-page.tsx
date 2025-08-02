
'use client';

import React, { useState } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip"
import { ProjectsList } from './projects-list';
import { ProjectDetails } from './project-details';

const projects = [
  { id: 1, name: "3. ΕΥΤΕΡΠΗΣ" },
  { id: 2, name: "Καληαρού & Κομνηνών" },
];


export function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <div className="flex h-full flex-1">
      <TooltipProvider delayDuration={100}>
        <ProjectsList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
        />
        <ProjectDetails project={selectedProject} />
      </TooltipProvider>
    </div>
  )
}

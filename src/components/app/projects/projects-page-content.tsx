
"use client";

import { useState } from 'react';
import { PageLayout } from '@/components/app/page-layout';
import { ProjectsList } from '@/components/app/projects/projects-list';

// Mock data, to be replaced with actual data fetching
const mockProjects = [
  { id: '1', name: '3. ΕΥΤΕΡΠΗΣ' },
  { id: '2', name: 'Καληαρού & Κομνηνών' },
];

export function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);

  return (
    <PageLayout>
      <ProjectsList
        projects={mockProjects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />
      <div className="flex-1">
        {/* Placeholder for project details */}
        <p>Project details for {selectedProject.name} will be shown here.</p>
      </div>
    </PageLayout>
  );
}

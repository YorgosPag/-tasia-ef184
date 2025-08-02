'use client';

import React, { useState } from 'react';
import { ProjectsList } from './projects-list';
import { ProjectDetails } from './project-details';
import { PageLayout } from '@/components/app/page-layout';

const projects = [
  { id: 1, name: "3. ΕΥΤΕΡΠΗΣ" },
  { id: 2, name: "Καληαρού & Κομνηνών" },
];


export function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <PageLayout>
        <ProjectsList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
        />
        <ProjectDetails project={selectedProject} />
    </PageLayout>
  )
}

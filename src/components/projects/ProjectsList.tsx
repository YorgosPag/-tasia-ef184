'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectToolbar } from './ProjectToolbar';
import type { Project } from '@/types/project';
import { ProjectListHeader } from './list/ProjectListHeader';
import { ProjectListItem } from './list/ProjectListItem';

interface ProjectsListProps {
  projects: Project[];
  selectedProject: Project;
  onSelectProject?: (project: Project) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function ProjectsList({
  projects,
  selectedProject,
  onSelectProject,
  getStatusColor,
  getStatusLabel
}: ProjectsListProps) {
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'value' | 'area' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleFavorite = (projectId: number) => {
    setFavorites(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };
  
  const sortedProjects = [...projects].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'progress':
        aValue = a.progress;
        bValue = b.progress;
        break;
      case 'value':
        aValue = a.totalValue;
        bValue = b.totalValue;
        break;
      case 'area':
        aValue = a.totalArea;
        bValue = b.totalArea;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  return (
    <div className="w-[420px] bg-card border rounded-lg flex flex-col shrink-0 shadow-sm">
      <ProjectListHeader 
        projects={projects}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <ProjectToolbar 
        selectedProject={selectedProject}
        onNew={() => console.log('Νέο έργο')}
        onEdit={() => console.log('Επεξεργασία έργου')}
        onDelete={() => console.log('Διαγραφή έργου')}
        onSave={() => console.log('Αποθήκευση')}
        onRefresh={() => console.log('Ανανέωση')}
        onExport={() => console.log('Εξαγωγή')}
        onImport={() => console.log('Εισαγωγή')}
      />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedProjects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              selectedProjectId={selectedProject?.id}
              onSelectProject={onSelectProject}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
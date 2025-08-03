import { useMemo } from 'react';
import type { Project, ProjectStats } from '@/types/project';

export function useProjectFilters(
  projects: Project[],
  searchTerm: string,
  filterCompany: string,
  filterStatus: string,
  filterCategory: string,
  filterMunicipality: string
) {
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany = filterCompany === 'all' || project.companyId === filterCompany;
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
      const matchesMunicipality = filterMunicipality === 'all' || project.municipality === filterMunicipality;

      return matchesSearch && matchesCompany && matchesStatus && matchesCategory && matchesMunicipality;
    });
  }, [projects, searchTerm, filterCompany, filterStatus, filterCategory, filterMunicipality]);

  const stats = useMemo<ProjectStats>(() => {
    const totalProjects = filteredProjects.length;
    const activeProjects = filteredProjects.filter(p => p.status === 'construction').length;
    const completedProjects = filteredProjects.filter(p => p.status === 'completed').length;
    const totalValue = filteredProjects.reduce((sum, p) => sum + p.totalValue, 0);
    const averageProgress = totalProjects > 0 
      ? filteredProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects 
      : 0;

    const projectsByStatus = filteredProjects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectsByCategory = filteredProjects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectsByCompany = filteredProjects.reduce((acc, project) => {
      acc[project.company] = (acc[project.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalValue,
      averageProgress,
      projectsByStatus,
      projectsByCategory,
      projectsByCompany,
    };
  }, [filteredProjects]);

  return { filteredProjects, stats };
}
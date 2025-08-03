export interface Project {
    id: number;
    name: string;
    title: string;
    description: string;
    address: string;
    city: string;
    municipality: string;
    postalCode: string;
    permitNumber: string;
    permitAuthority: string;
    buildingBlock: string;
    protocolNumber: string;
    status: 'planning' | 'approved' | 'construction' | 'completed' | 'suspended';
    startDate: string;
    completionDate: string;
    progress: number;
    totalValue: number;
    company: string;
    companyId: string;
    category: 'residential' | 'commercial' | 'mixed' | 'industrial' | 'public';
    totalArea: number;
    buildingCount: number;
    floorCount: number;
    unitCount: number;
    showOnWeb: boolean;
    mapPath?: string;
    planPath?: string;
    percentageTablePath?: string;
    features: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProjectStats {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalValue: number;
    averageProgress: number;
    projectsByStatus: Record<string, number>;
    projectsByCategory: Record<string, number>;
    projectsByCompany: Record<string, number>;
  }
  
  export interface Company {
    id: string;
    name: string;
    type: 'individual' | 'company' | 'public';
  }
  
  export interface ProjectFilters {
    searchTerm: string;
    company: string;
    status: string;
    category: string;
    municipality: string;
  }
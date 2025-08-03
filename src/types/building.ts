export type Building = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  totalArea: number;
  builtArea: number;
  floors: number;
  units: number;
  status: 'active' | 'construction' | 'planned' | 'completed';
  startDate?: string;
  completionDate?: string;
  progress: number;
  totalValue: number;
  image?: string;
  company: string;
  project: string;
  category: 'residential' | 'commercial' | 'mixed' | 'industrial';
  features?: string[];
};

export type Milestone = {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  progress: number;
  type: 'start' | 'construction' | 'systems' | 'finishing' | 'delivery';
};

export type NearbyProject = {
  id: number;
  name: string;
  distance: string;
  status: 'active' | 'completed' | 'planning';
  type: 'commercial' | 'residential' | 'office';
  progress: number;
};

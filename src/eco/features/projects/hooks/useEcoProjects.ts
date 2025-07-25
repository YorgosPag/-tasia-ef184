'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export interface Project {
    id: string;
    ownerName: string;
    applicationId: string;
    title: string;
    status: 'Προσφορά' | 'Ενεργό' | 'Ολοκληρωμένο' | 'Ακυρωμένο';
    deadline?: Date;
    progress: number;
    totalBudget: number;
    notifications: number;
    derivedStatus: 'Εντός Χρονοδιαγράμματος' | 'Σε Καθυστέρηση' | 'Ολοκληρωμένο' | 'Προσφορά' | 'Ακυρωμένο';
}

const mockProjects: Project[] = [
  { id: '1', ownerName: 'Ελένη Παπαδοπούλου', applicationId: 'ΠΡ-2024-089', title: 'Προσφορά για Ανακαίνιση Κατοικίας Παπαδοπούλου', status: 'Προσφορά', deadline: new Date('2024-08-15'), progress: 0, totalBudget: 6800, notifications: 0, derivedStatus: 'Προσφορά' },
  { id: '2', ownerName: 'Νικόλαος Γεωργίου', applicationId: 'ΦΒ-2025-001', title: "Κατασκευή φωτοβολταϊκού πάρκου 'ΓΕΩΡΓΙΟΥ ΚΑΤΑΣΚΕΥΑΣΤΙΚΗ'", status: 'Ενεργό', deadline: new Date('2024-06-30'), progress: 40, totalBudget: 88000, notifications: 1, derivedStatus: 'Σε Καθυστέρηση' },
  { id: '3', ownerName: 'Ανατολή Εύα Καραγιάννη', applicationId: 'ΕΚΟ-24-9988', title: 'Ενεργειακή Αναβάθμιση Κατοικίας Καραγιάννη', status: 'Ενεργό', deadline: new Date('2025-01-31'), progress: 50, totalBudget: 1650, notifications: 1, derivedStatus: 'Σε Καθυστέρηση' },
  { id: '4', ownerName: 'Αγγελάκος Κωνσταντινούδης', applicationId: '61-038111', title: 'Ανακαίνιση κατοικίας Αγγέλου Κωνσταντινίδη', status: 'Ενεργό', deadline: new Date('2025-09-30'), progress: 20, totalBudget: 14700, notifications: 0, derivedStatus: 'Εντός Χρονοδιαγράμματος' },
  { id: '5', ownerName: 'Μαρία Αντωνίου', applicationId: '-', title: 'Προσφορά για μόνωση ταράτσας Μαρίας Αντωνίου', status: 'Προσφορά', deadline: new Date('2024-09-10'), progress: 67, totalBudget: 4500, notifications: 0, derivedStatus: 'Προσφορά' },
  { id: '6', ownerName: 'Ευάγγελος Αχτσόγλου', applicationId: '41-282254', title: 'Αχτσόγλου Ευάγγελος ΕΚΟ21', status: 'Ενεργό', deadline: new Date('2025-08-30'), progress: 33, totalBudget: 9000, notifications: 0, derivedStatus: 'Εντός Χρονοδιαγράμματος' },
  { id: '7', ownerName: 'Κωνσταντίνος Δάσκος', applicationId: '33-198765', title: 'Ενεργειακή αναβάθμιση κατοικίας Δάσκου', status: 'Ενεργό', deadline: new Date('2025-07-15'), progress: 60, totalBudget: 19200, notifications: 1, derivedStatus: 'Σε Καθυστέρηση' },
  { id: '8', ownerName: 'Κώστας Μιχαηλίδης', applicationId: 'ΕΞ-2024-055', title: 'Ακύρωση έργου Κώστα Μιχαηλίδη', status: 'Ακυρωμένο', deadline: undefined, progress: 0, totalBudget: 0, notifications: 0, derivedStatus: 'Ακυρωμένο' },
  { id: '9', ownerName: 'Ελένη Παπαδοπούλου', applicationId: 'ΠΡ-2024-089', title: 'Προσφορά για Ανακαίνιση Κατοικίας Παπαδοπούλου', status: 'Ολοκληρωμένο', deadline: new Date('2023-08-15'), progress: 100, totalBudget: 6800, notifications: 0, derivedStatus: 'Ολοκληρωμένο' },
  { id: '10', ownerName: 'Νικόλαος Γεωργίου', applicationId: 'ΦΒ-2025-001', title: "Κατασκευή φωτοβολταϊκού πάρκου 'ΓΕΩΡΓΙΟΥ ΚΑΤΑΣΚΕΥΑΣΤΙΚΗ'", status: 'Ολοκληρωμένο', deadline: new Date('2024-01-30'), progress: 100, totalBudget: 88000, notifications: 0, derivedStatus: 'Ολοκληρωμένο' },
];

const deriveStatus = (project: Omit<Project, 'derivedStatus'>): Project['derivedStatus'] => {
    if (project.status === 'Ακυρωμένο') return 'Ακυρωμένο';
    if (project.status === 'Ολοκληρωμένο') return 'Ολοκληρωμένο';
    if (project.status === 'Προσφορά') return 'Προσφορά';
    if (project.deadline && project.deadline < new Date()) return 'Σε Καθυστέρηση';
    return 'Εντός Χρονοδιαγράμματος';
};

const getProjects = (): Promise<Project[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const projectsWithDerivedStatus = mockProjects.map(p => ({
                ...p,
                derivedStatus: deriveStatus(p)
            }));
            resolve(projectsWithDerivedStatus);
        }, 500); // Simulate network delay
    });
};


export function useEcoProjects() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [activeTab, setActiveTab] = useState<Project['derivedStatus'] | 'Όλα'>('Όλα');

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const fetchedProjects = await getProjects();
      setAllProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects);
      setIsLoading(false);
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    const results = allProjects.filter(project => {
      return (
        project.title.toLowerCase().includes(lowercasedQuery) ||
        project.ownerName.toLowerCase().includes(lowercasedQuery) ||
        project.applicationId.toLowerCase().includes(lowercasedQuery)
      );
    });
    setFilteredProjects(results);
  }, [debouncedSearchQuery, allProjects]);

  const counts = allProjects.reduce((acc, p) => {
    acc.all++;
    if (p.derivedStatus === 'Προσφορά') acc.offer++;
    if (p.derivedStatus === 'Εντός Χρονοδιαγράμματος') acc.onTrack++;
    if (p.derivedStatus === 'Σε Καθυστέρηση') acc.delayed++;
    if (p.derivedStatus === 'Ολοκληρωμένο') acc.completed++;
    if (p.derivedStatus === 'Ακυρωμένο') acc.cancelled++;
    return acc;
  }, { all: 0, offer: 0, onTrack: 0, delayed: 0, completed: 0, cancelled: 0 });

  return {
    projects: filteredProjects,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    counts,
  };
}

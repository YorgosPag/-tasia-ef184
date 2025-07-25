'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/eco/features/projects/components/ProjectCard';
import { useEcoProjects } from '@/eco/features/projects/hooks/useEcoProjects';
import { useRouter } from 'next/navigation';

export default function EcoProjectsPage() {
  const router = useRouter();
  const { 
    projects, 
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    counts,
   } = useEcoProjects();

  const handleCreateProject = () => {
    // This would navigate to a new project/offer creation page
    // router.push('/eco/projects/new');
    alert('Η δημιουργία νέου έργου/προσφοράς θα υλοποιηθεί σύντομα.');
  }

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'Όλα') return true;
    return p.derivedStatus === activeTab;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Λίστα Έργων & Προσφορών</h1>
          <p className="text-muted-foreground">Δείτε και διαχειριστείτε όλες τις προσφορές, τα ενεργά και τα ολοκληρωμένα έργα.</p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          Δημιουργία Έργου/Προσφοράς
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Αναζήτηση έργου, αίτησης, ή ιδιοκτήτη..." 
            className="pl-10 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="Όλα">Όλα ({counts.all})</TabsTrigger>
            <TabsTrigger value="Προσφορά">Προσφορά ({counts.offer})</TabsTrigger>
            <TabsTrigger value="Εντός Χρονοδιαγράμματος">Ενεργά ({counts.onTrack})</TabsTrigger>
            <TabsTrigger value="Σε Καθυστέρηση">Σε Καθυστέρηση ({counts.delayed})</TabsTrigger>
            <TabsTrigger value="Ολοκληρωμένο">Ολοκληρωμένο ({counts.completed})</TabsTrigger>
            <TabsTrigger value="Ακυρωμένο">Ακυρωμένο ({counts.cancelled})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
       { !isLoading && filteredProjects.length === 0 && (
         <div className="text-center col-span-full py-10">
            <p className="text-muted-foreground">Δεν βρέθηκαν έργα που να ταιριάζουν στα κριτήρια.</p>
         </div>
       )}
    </div>
  );
}

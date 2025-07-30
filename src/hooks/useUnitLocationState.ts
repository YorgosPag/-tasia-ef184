
'use client';

import { useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface BaseEntity {
    id: string;
    [key: string]: any;
}

interface Project extends BaseEntity {
    companyId: string;
}

interface Building extends BaseEntity {
    projectId: string;
}

interface Floor {
    value: string;
    label: string;
    buildingId: string;
}

interface DataStore {
    companies: BaseEntity[];
    projects: Project[];
    buildings: Building[];
}


export function useUnitLocationState(data: DataStore, form: UseFormReturn<any>) {
    const { companies, projects, buildings } = data;
    const [isLoadingFloors, setIsLoadingFloors] = useState(false);
    const [floors, setFloors] = useState<Floor[]>([]);

    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('');

    useEffect(() => {
        setSelectedProject('');
        form.setValue('projectId', '');
    }, [selectedCompany, form]);

    useEffect(() => {
        setSelectedBuilding('');
        form.setValue('buildingId', '');
    }, [selectedProject, form]);

    useEffect(() => {
        form.setValue('floorIds', []);
        const fetchFloors = async () => {
            if (!selectedBuilding) {
                setFloors([]);
                return;
            }
            setIsLoadingFloors(true);
            // In a real app, this would be a fetch call to an API
            // e.g., const floorsData = await fetchFloorsForBuilding(selectedBuilding);
            // For now, we simulate with static data if available or leave it empty.
            // This part needs to be connected to the actual data source.
            // For now, it will be empty as we don't have a direct way to query floors here.
            setFloors([]);
            setIsLoadingFloors(false);
        };
        fetchFloors();
    }, [selectedBuilding, form]);
    
    const floorIds = form.watch('floorIds');
    useEffect(() => {
        const span = Array.isArray(floorIds) ? floorIds.length : 0;
        form.setValue('levelSpan', span);
    }, [floorIds, form]);


    const filteredProjects = useMemo(() => projects.filter(p => p.companyId === selectedCompany), [projects, selectedCompany]);
    const filteredBuildings = useMemo(() => buildings.filter(b => b.projectId === selectedProject), [buildings, selectedProject]);
    
     const floorOptions = useMemo(() => {
        // This is a placeholder. In a real scenario, you'd fetch floors based on selectedBuilding
        return floors.map(f => ({ value: f.value, label: f.label }));
    }, [floors]);


    return {
        companies,
        selectedCompany,
        setSelectedCompany,
        filteredProjects,
        selectedProject,
        setSelectedProject,
        filteredBuildings,
        selectedBuilding,
        setSelectedBuilding,
        floors: floorOptions,
        isLoadingFloors
    };
}

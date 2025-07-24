
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Company, Project, Building } from './use-data-store';
import type { UseFormReturn } from 'react-hook-form';
import type { NewUnitFormValues } from '@/lib/unit-helpers';

interface UseUnitLocationStateProps {
    companies: Company[];
    projects: Project[];
    buildings: Building[];
}

/**
 * A custom hook to manage the cascading state for selecting a unit's location
 * (Company -> Project -> Building -> Floor(s)).
 */
export function useUnitLocationState(
    { companies, projects, buildings }: UseUnitLocationStateProps,
    form: UseFormReturn<NewUnitFormValues>,
    isMultiFloorAllowed: boolean,
) {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [floors, setFloors] = useState<{ value: string; label: string }[]>([]);
    const [isLoadingFloors, setIsLoadingFloors] = useState(false);

    const { setValue, watch } = form;
    const selectedFloorIds = watch('floorIds');
    const selectedType = watch('type');

    // Memoized lists for dependent dropdowns
    const filteredProjects = useMemo(() => projects.filter(p => p.companyId === selectedCompany), [projects, selectedCompany]);
    const filteredBuildings = useMemo(() => buildings.filter(b => b.projectId === selectedProject), [buildings, selectedProject]);

    // Effect to fetch floors when a building is selected
    useEffect(() => {
        const fetchFloors = async () => {
            if (!selectedBuilding) {
                setFloors([]);
                return;
            }
            setIsLoadingFloors(true);
            const floorsQuery = query(collection(db, 'floors'), where('buildingId', '==', selectedBuilding));
            const floorsSnapshot = await getDocs(floorsQuery);
            const fetchedFloors = floorsSnapshot.docs.map(doc => ({ value: doc.id, label: doc.data().level } as { value: string; label: string }));
            
            fetchedFloors.sort((a, b) => {
                const levelA = parseInt(a.label, 10);
                const levelB = parseInt(b.label, 10);
                return isNaN(levelA) || isNaN(levelB) ? a.label.localeCompare(b.label, undefined, { numeric: true }) : levelA - levelB;
            });

            setFloors(fetchedFloors);
            setIsLoadingFloors(false);
        }
        fetchFloors();
    }, [selectedBuilding]);

    // Effects to reset dependent fields on change
    useEffect(() => {
        if (selectedCompany) {
            setSelectedProject('');
            setSelectedBuilding('');
            setValue('floorIds', []);
        }
    }, [selectedCompany, setValue]);

    useEffect(() => {
        if (selectedProject) {
            setSelectedBuilding('');
            setValue('floorIds', []);
        }
    }, [selectedProject, setValue]);

    useEffect(() => {
        setValue('floorIds', []);
    }, [selectedType, setValue]);
    
    // Effect to automatically update the 'levelSpan' field
    useEffect(() => {
        setValue('levelSpan', selectedFloorIds?.length || 1);
    }, [selectedFloorIds, setValue]);

    return {
        companies, // Pass companies through
        selectedCompany,
        setSelectedCompany,
        selectedProject,
        setSelectedProject,
        selectedBuilding,
        setSelectedBuilding,
        floors,
        isLoadingFloors,
        filteredProjects,
        filteredBuildings,
        selectedFloorIds,
    };
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { Company, Project, Building } from '@/shared/hooks/use-data-store';
import type { UseFormReturn } from 'react-hook-form';
import type { NewUnitFormValues } from '@/shared/lib/unit-helpers';

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
                if (!isNaN(levelA) && !isNaN(levelB)) {
                    return levelA - levelB;
                }
                return a.label.localeCompare(b.label, undefined, { numeric: true });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompany, setValue]);

    useEffect(() => {
        if (selectedProject) {
            setSelectedBuilding('');
            setValue('floorIds', []);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProject, setValue]);
    
    useEffect(() => {
        if (selectedBuilding) {
            setValue('floorIds', []);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBuilding, setValue]);


    useEffect(() => {
        setValue('floorIds', []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedType, setValue]);
    
    // Effect to automatically update the 'levelSpan' field
    useEffect(() => {
        setValue('levelSpan', selectedFloorIds?.length || 0);
    }, [selectedFloorIds, setValue]);

    return {
        companies, 
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

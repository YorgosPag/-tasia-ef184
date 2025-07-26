
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getStatusVariant } from '@/tasia/components/projects/work-stages/utils';

// --- Types ---
interface Project {
    id: string;
    title: string;
}

interface WorkStage {
    id: string;
    name: string;
    status: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
    startDate?: Timestamp;
    endDate?: Timestamp;
    deadline?: Timestamp;
}

interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    type: 'start' | 'end' | 'deadline';
    status: WorkStage['status'];
    projectId: string;
    color: string;
}

const statusColorMap: Record<WorkStage['status'], string> = {
    'Εκκρεμεί': 'bg-gray-400',
    'Σε εξέλιξη': 'bg-blue-500',
    'Ολοκληρώθηκε': 'bg-green-500',
    'Καθυστερεί': 'bg-red-500',
};

// --- Hook ---
export function useWorkStageCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [month, setMonth] = useState(new Date());

    useEffect(() => {
        const fetchCalendarData = async () => {
            setIsLoading(true);
            const allEvents: CalendarEvent[] = [];

            try {
                const projectsSnapshot = await getDocs(query(collection(db, 'projects')));

                for (const projectDoc of projectsSnapshot.docs) {
                    const project = { id: projectDoc.id, ...projectDoc.data() } as Project;
                    const workStagesRef = collection(db, 'projects', project.id, 'workStages');
                    const workStagesSnapshot = await getDocs(workStagesRef);

                    for (const stageDoc of workStagesSnapshot.docs) {
                        const stage = { id: stageDoc.id, ...stageDoc.data() } as WorkStage;
                        const stageTitle = `${project.title}: ${stage.name}`;

                        if (stage.startDate) {
                            allEvents.push({
                                id: stage.id,
                                date: stage.startDate.toDate(),
                                title: `Έναρξη - ${stageTitle}`,
                                type: 'start',
                                status: stage.status,
                                projectId: project.id,
                                color: statusColorMap[stage.status],
                            });
                        }
                        if (stage.endDate) {
                            allEvents.push({
                                id: stage.id,
                                date: stage.endDate.toDate(),
                                title: `Λήξη - ${stageTitle}`,
                                type: 'end',
                                status: stage.status,
                                projectId: project.id,
                                color: statusColorMap[stage.status],
                            });
                        }
                        if (stage.deadline) {
                             allEvents.push({
                                id: stage.id,
                                date: stage.deadline.toDate(),
                                title: `Προθεσμία - ${stageTitle}`,
                                type: 'deadline',
                                status: stage.status,
                                projectId: project.id,
                                color: statusColorMap[stage.status],
                            });
                        }

                        // Fetch substages
                        const substagesRef = collection(stageDoc.ref, 'workSubstages');
                        const substagesSnapshot = await getDocs(substagesRef);
                        for (const subStageDoc of substagesSnapshot.docs) {
                             const subStage = { id: subStageDoc.id, ...subStageDoc.data() } as WorkStage;
                             const subStageTitle = `${stageTitle} > ${subStage.name}`;
                             if (subStage.startDate) allEvents.push({ id: subStage.id, date: subStage.startDate.toDate(), title: `Έναρξη - ${subStageTitle}`, type: 'start', status: subStage.status, projectId: project.id, color: statusColorMap[subStage.status] });
                             if (subStage.endDate) allEvents.push({ id: subStage.id, date: subStage.endDate.toDate(), title: `Λήξη - ${subStageTitle}`, type: 'end', status: subStage.status, projectId: project.id, color: statusColorMap[subStage.status] });
                             if (subStage.deadline) allEvents.push({ id: subStage.id, date: subStage.deadline.toDate(), title: `Προθεσμία - ${subStageTitle}`, type: 'deadline', status: subStage.status, projectId: project.id, color: statusColorMap[subStage.status] });
                        }
                    }
                }
                setEvents(allEvents);
            } catch (error) {
                console.error("Failed to fetch calendar data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCalendarData();
    }, []); // Fetch only once

    return {
        events,
        isLoading,
        month,
        setMonth,
    };
}

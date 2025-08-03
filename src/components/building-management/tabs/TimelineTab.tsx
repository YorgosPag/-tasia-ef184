'use client';

import React, { useState } from 'react';
import type { Building, Milestone } from '@/types/building';
import { TimelineOverview } from './timeline/TimelineOverview';
import { MilestoneList } from './timeline/MilestoneList';
import { TimelineCritical } from './timeline/TimelineCritical';
import { TimelineForecast } from './timeline/TimelineForecast';


export function TimelineTab({ building }: { building: Building }) {
  const [milestones] = useState<Milestone[]>([
    { id: 1, title: "Έναρξη Έργου", description: "Υπογραφή συμβολαίου και έναρξη εργασιών", date: "2006-05-02", status: "completed", progress: 100, type: "start" },
    { id: 2, title: "Θεμέλια & Υπόγειο", description: "Ολοκλήρωση εκσκαφών και κατασκευή θεμελίων", date: "2006-08-15", status: "completed", progress: 100, type: "construction" },
    { id: 3, title: "Κατασκευή Φέροντα Οργανισμού", description: "Σκελετός κτιρίου - όροφοι 1-7", date: "2007-12-20", status: "completed", progress: 100, type: "construction" },
    { id: 4, title: "Τοιχοποιίες & Στεγανοποίηση", description: "Κλείσιμο κτιρίου και στεγανότητα", date: "2008-06-30", status: "completed", progress: 100, type: "construction" },
    { id: 5, title: "Ηλ/Μηχ Εγκαταστάσεις", description: "Ηλεκτρολογικές και μηχανολογικές εγκαταστάσεις", date: "2008-11-15", status: "in-progress", progress: 85, type: "systems" },
    { id: 6, title: "Τελικές Εργασίες", description: "Χρωματισμοί, δάπεδα, διακοσμητικά στοιχεία", date: "2009-01-30", status: "pending", progress: 45, type: "finishing" },
    { id: 7, title: "Παράδοση Έργου", description: "Τελικός έλεγχος και παράδοση στον πελάτη", date: "2009-02-28", status: "pending", progress: 0, type: "delivery" }
  ]);

  const daysUntilCompletion = building.completionDate ? Math.ceil((new Date(building.completionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="space-y-6">
        <TimelineOverview 
            building={building} 
            milestones={milestones} 
            daysUntilCompletion={daysUntilCompletion} 
        />
        <MilestoneList milestones={milestones} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimelineCritical />
            <TimelineForecast />
        </div>
    </div>
  );
}

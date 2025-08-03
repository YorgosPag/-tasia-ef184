'use client';

import React, { useState } from 'react';
import { BuildingsList } from './BuildingsList';
import { BuildingDetails } from './BuildingDetails';
import { PageLayout } from '@/components/app/page-layout';

// Mock data, as seen in the screenshot
const buildings = [
  { id: 1, name: "ΚΤΙΡΙΟ Α (Μανδηλαρά - Πεζόδρομος & Πεζόδρομος)" },
  { id: 2, name: "ΚΤΙΡΙΟ Β (Μανδηλαρά & Πεζόδρομος)" },
  { id: 3, name: "ΚΤΙΡΙΟ Γ (Μανδηλαρά - Παλαιολόγου & Πεζόδρομος)" },
];

export function BuildingsPageContent() {
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);

  return (
    <PageLayout>
        <BuildingsList
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
        />
        <BuildingDetails building={selectedBuilding} />
    </PageLayout>
  );
}

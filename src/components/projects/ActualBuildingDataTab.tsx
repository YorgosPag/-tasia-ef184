'use client';
import React from 'react';

export type ActualData = {
    construction: number;
    plotCoverage: number;
    semiOutdoorArea: number;
    balconyArea: number;
    height: number;
};

export type CalculatedActualData = {
    coveragePercentage: number;
    semiOutdoorPercentage: number;
alconyPercentage: number;
    combinedArea: number;
    combinedPercentage: number;
    volumeExploitation: number;
    volumeCoefficient: number;
};

interface ActualBuildingDataTabProps {
    actualData: ActualData;
    calculatedData: CalculatedActualData;
    onActualDataChange: (newData: Partial<ActualData>) => void;
}

export function ActualBuildingDataTab(props: ActualBuildingDataTabProps) {
  return <div>Πραγματοποιούμενα Στοιχεία Δόμησης</div>;
}

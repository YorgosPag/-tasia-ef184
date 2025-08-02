'use client';
import React from 'react';

export type AllowedDataInput = {
    maxCoveragePercentage: number;
    maxSemiOutdoorPercentage: number;
    maxBalconyPercentage: number;
    maxCombinedPercentage: number;
    maxVolumeCoefficient: number;
    maxAllowedHeight: number;
};

export type AllowedDataCalculated = {
    maxAllowedConstruction: number;
    maxPlotCoverage: number;
    maxAllowedSemiOutdoorArea: number;
    maxBalconyArea: number;
    maxCombinedArea: number;
    maxVolumeExploitation: number;
};

interface AllowedBuildingDataTabProps {
    allowedDataInput: AllowedDataInput;
    calculatedData: AllowedDataCalculated;
    onInputChange: (newData: Partial<AllowedDataInput>) => void;
}

export function AllowedBuildingDataTab(props: AllowedBuildingDataTabProps) {
  return <div>Επιτρεπόμενα Στοιχεία Δόμησης</div>;
}

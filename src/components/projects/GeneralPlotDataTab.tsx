'use client';
import React from 'react';

export type PlotData = {
  sdNoSocial: number;
  socialFactor: number;
  plotArea: number;
  sdFinal?: number;
};

interface GeneralPlotDataTabProps {
  plotData: PlotData;
  onPlotDataChange: (newData: Partial<PlotData>) => void;
}

export function GeneralPlotDataTab({ plotData, onPlotDataChange }: GeneralPlotDataTabProps) {
  return <div>Όροι Δόμησης Οικοπέδου</div>;
}

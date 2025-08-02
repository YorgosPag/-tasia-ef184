'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralPlotDataTab, type PlotData } from './GeneralPlotDataTab';
import { AllowedBuildingDataTab, type AllowedDataInput, type AllowedDataCalculated } from './AllowedBuildingDataTab';
import { ActualBuildingDataTab, type ActualData, type CalculatedActualData } from './ActualBuildingDataTab';
import { OtherDataTab } from './OtherDataTab';
import { Button } from '@/components/ui/button';
import { Save, Pencil, X } from 'lucide-react';

export function BuildingDataTab() {
  const [isEditing, setIsEditing] = useState(false);

  const [plotData, setPlotData] = useState<PlotData>({
    sdNoSocial: 1.8,
    socialFactor: 1.0,
    plotArea: 2178.90,
  });

  const [allowedDataInput, setAllowedDataInput] = useState<AllowedDataInput>({
    maxCoveragePercentage: 70,
    maxSemiOutdoorPercentage: 15,
    maxBalconyPercentage: 40,
    maxCombinedPercentage: 40,
    maxVolumeCoefficient: 5.5,
    maxAllowedHeight: 17.5,
  });

  const [actualData, setActualData] = useState<ActualData>({
    construction: 3922.02,
    plotCoverage: 1478.9,
    semiOutdoorArea: 245.89,
    balconyArea: 456.89,
    height: 17.5,
  });

  const handlePlotDataChange = useCallback((newData: Partial<PlotData>) => {
    setPlotData(prev => ({ ...prev, ...newData }));
  }, []);

  const handleAllowedDataChange = useCallback((newData: Partial<AllowedDataInput>) => {
    setAllowedDataInput(prev => ({ ...prev, ...newData }));
  }, []);
  
  const handleActualDataChange = useCallback((newData: Partial<ActualData>) => {
    setActualData(prev => ({...prev, ...newData}));
  }, []);

  const sdFinal = useMemo(() => {
    return plotData.sdNoSocial * plotData.socialFactor;
  }, [plotData.sdNoSocial, plotData.socialFactor]);

  const calculatedAllowedData = useMemo<AllowedDataCalculated>(() => {
    const maxAllowedConstruction = sdFinal * plotData.plotArea;
    const maxPlotCoverage = (allowedDataInput.maxCoveragePercentage / 100) * plotData.plotArea;
    const maxAllowedSemiOutdoorArea = (allowedDataInput.maxSemiOutdoorPercentage / 100) * maxAllowedConstruction;
    const maxBalconyArea = (allowedDataInput.maxBalconyPercentage / 100) * maxAllowedConstruction;
    const maxCombinedArea = (allowedDataInput.maxCombinedPercentage / 100) * maxAllowedConstruction;
    const maxVolumeExploitation = plotData.plotArea * allowedDataInput.maxVolumeCoefficient;
    return {
      maxAllowedConstruction,
      maxPlotCoverage,
      maxAllowedSemiOutdoorArea,
      maxBalconyArea,
      maxCombinedArea,
      maxVolumeExploitation,
    };
  }, [sdFinal, plotData.plotArea, allowedDataInput]);

  const calculatedActualData = useMemo<CalculatedActualData>(() => {
    const coveragePercentage = plotData.plotArea > 0 ? actualData.plotCoverage / plotData.plotArea : 0;
    const semiOutdoorPercentage = actualData.construction > 0 ? actualData.semiOutdoorArea / actualData.construction : 0;
    const balconyPercentage = actualData.construction > 0 ? actualData.balconyArea / actualData.construction : 0;
    const combinedArea = actualData.semiOutdoorArea + actualData.balconyArea;
    const combinedPercentage = actualData.construction > 0 ? combinedArea / actualData.construction : 0;
    const volumeExploitation = 0; // Placeholder for now
    const volumeCoefficient = plotData.plotArea > 0 ? volumeExploitation / plotData.plotArea : 0;
    return {
      coveragePercentage,
      semiOutdoorPercentage,
      balconyPercentage,
      combinedArea,
      combinedPercentage,
      volumeExploitation,
      volumeCoefficient,
    };
  }, [actualData, plotData.plotArea]);


  return (
     <div className="space-y-4">
        <div className="flex justify-end items-center gap-2">
            {isEditing ? (
                <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        <Save className="w-4 h-4 mr-2" />
                        Αποθήκευση
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Ακύρωση
                    </Button>
                </>
            ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Επεξεργασία
                </Button>
            )}
        </div>
        <Tabs defaultValue="general-plot-data" className="w-full"
            onValueChange={() => {
                // Logic to handle tab changes if needed
            }}
        >
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general-plot-data">Όροι Δόμησης Οικοπέδου</TabsTrigger>
                <TabsTrigger value="allowed-data">Επιτρεπόμενα</TabsTrigger>
                <TabsTrigger value="actual-data">Πραγματοποιούμενα</TabsTrigger>
                <TabsTrigger value="other-data">Λοιπά Στοιχεία</TabsTrigger>
            </TabsList>
            <TabsContent value="general-plot-data" className="pt-4">
                <GeneralPlotDataTab 
                    plotData={{...plotData, sdFinal}}
                    onPlotDataChange={handlePlotDataChange}
                />
            </TabsContent>
            <TabsContent value="allowed-data" className="pt-4">
                 <AllowedBuildingDataTab 
                    allowedDataInput={allowedDataInput}
                    calculatedData={calculatedAllowedData}
                    onInputChange={handleAllowedDataChange}
                />
            </TabsContent>
            <TabsContent value="actual-data" className="pt-4">
                <ActualBuildingDataTab 
                    actualData={actualData}
                    calculatedData={calculatedActualData}
                    onActualDataChange={handleActualDataChange}
                />
            </TabsContent>
            <TabsContent value="other-data" className="pt-4">
                <OtherDataTab />
            </TabsContent>
        </Tabs>
     </div>
  );
}

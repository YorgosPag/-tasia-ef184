'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

export interface AllowedDataInput {
    maxCoveragePercentage: number;
    maxSemiOutdoorPercentage: number;
    maxBalconyPercentage: number;
    maxCombinedPercentage: number;
    maxVolumeCoefficient: number;
    maxAllowedHeight: number;
}

export interface AllowedDataCalculated {
    maxAllowedConstruction: number;
    maxPlotCoverage: number;
    maxAllowedSemiOutdoorArea: number;
    maxBalconyArea: number;
    maxCombinedArea: number;
    maxVolumeExploitation: number;
}

interface AllowedBuildingDataTabProps {
    allowedDataInput: AllowedDataInput;
    calculatedData: AllowedDataCalculated;
    onInputChange: (newData: Partial<AllowedDataInput>) => void;
}

const CalculationFormula = ({ text, className }: { text: string; className?: string }) => {
    if (!text) return <div className="h-8" />;
    return (
        <div className={cn("h-8 flex items-center text-sm")}>
            <span className="mr-2 text-muted-foreground">=</span>
            <span className={cn("text-muted-foreground", className)}>{text}</span>
        </div>
    );
};

export function AllowedBuildingDataTab({ allowedDataInput, calculatedData, onInputChange }: AllowedBuildingDataTabProps) {
    const formRef = useRef<HTMLDivElement>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onInputChange({ [name]: parseFloat(value) || 0 });
    };

    const handleEnterNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const focusable = Array.from(
            formRef.current.querySelectorAll(
                'input:not([readonly])'
            )
        ) as HTMLElement[];

        const currentIndex = focusable.indexOf(e.currentTarget);
        const nextIndex = (currentIndex + 1) % focusable.length;
        
        if (nextIndex < focusable.length) {
            focusable[nextIndex].focus();
        }
    };


    return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">Επιτρεπόμενα Στοιχεία Δόμησης</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex justify-center">
            <div className="flex gap-x-8" ref={formRef}>
                {/* Left Column - Fields */}
                <div className="space-y-3">
                    <FormField label="Μέγιστη Επιτρεπόμενη Δόμηση" id="maxAllowedConstruction" value={calculatedData.maxAllowedConstruction} unit="τ.μ." readOnly labelPosition='left' inputClassName="w-40" unitPosition="left" useGrouping />
                    <FormField label="Μέγιστο Ποσοστό Κάλυψης" id="maxCoveragePercentage" value={allowedDataInput.maxCoveragePercentage} unit="%" labelClassName="text-green-600 dark:text-green-500" onChange={handleChange} onEnterPress={handleEnterNavigation} isPercentage labelPosition='left' inputClassName="w-40" unitPosition="left" />
                    <FormField label="Μέγιστη Κάλυψη Οικοπέδου" id="maxPlotCoverage" value={calculatedData.maxPlotCoverage} unit="τ.μ." labelClassName="text-blue-600 dark:text-blue-500" readOnly labelPosition='left' inputClassName="w-40" unitPosition="left" useGrouping />
                    <FormField label="Μέγιστο Ποσοστό Η/Χ" id="maxSemiOutdoorPercentage" value={allowedDataInput.maxSemiOutdoorPercentage} unit="%" labelClassName="text-orange-600 dark:text-orange-500" onChange={handleChange} onEnterPress={handleEnterNavigation} isPercentage labelPosition='left' inputClassName="w-40" unitPosition="left" />
                    <FormField label="Μέγιστη Επιτρεπόμενη Επιφάνεια Η/Χ" id="maxAllowedSemiOutdoorArea" value={calculatedData.maxAllowedSemiOutdoorArea} unit="τ.μ." labelClassName="text-red-500" readOnly labelPosition='left' inputClassName="w-40" unitPosition="left" useGrouping />
                    <FormField label="Μέγιστο Ποσοστό Εξωστών" id="maxBalconyPercentage" value={allowedDataInput.maxBalconyPercentage} unit="%" labelClassName="text-cyan-600 dark:text-cyan-500" onChange={handleChange} onEnterPress={handleEnterNavigation} isPercentage labelPosition='left' inputClassName="w-40" unitPosition="left" />
                    <FormField label="Μέγιστη Επιφάνεια Εξωστών" id="maxBalconyArea" value={calculatedData.maxBalconyArea} unit="τ.μ." labelClassName="text-fuchsia-600 dark:text-fuchsia-500" readOnly labelPosition='left' inputClassName="w-40" unitPosition="left" useGrouping />
                    <FormField label="Μέγ. Ποσοστό Επιτρεπ. Η/Χ + Εξωστών" id="maxCombinedPercentage" value={allowedDataInput.maxCombinedPercentage} unit="%" labelClassName="text-teal-600 dark:text-teal-500" onChange={handleChange} onEnterPress={handleEnterNavigation} isPercentage labelPosition='left' inputClassName="w-40" unitPosition="left" />
                    <FormField label="Μέγ. Επιτρεπόμενη Επιφ. Η/Χ & Εξωστών" id="maxCombinedArea" value={calculatedData.maxCombinedArea} unit="τ.μ." labelClassName="text-sky-600 dark:text-sky-500" readOnly labelPosition='left' inputClassName="w-40" unitPosition="left" useGrouping />
                    <FormField label="Μέγιστος Συντελεστής Όγκου (Σ.Ο.)" id="maxVolumeCoefficient" value={allowedDataInput.maxVolumeCoefficient} unit="" labelClassName="text-lime-600 dark:text-lime-500" onChange={handleChange} onEnterPress={handleEnterNavigation} labelPosition='left' inputClassName="w-40" />
                    <FormField label="Μέγιστη Κατ’ Όγκο Εκμετάλλευση" id="maxVolumeExploitation" value={calculatedData.maxVolumeExploitation} unit="κ.μ." labelClassName="text-red-600 dark:text-red-500" readOnly labelPosition='left' inputClassName="w-40" unitPosition="left" useGrouping />
                    <FormField label="Μέγιστο Επιτρεπόμενο Ύψος" id="maxAllowedHeight" value={allowedDataInput.maxAllowedHeight} unit="m" labelClassName="text-indigo-500" onChange={handleChange} onEnterPress={handleEnterNavigation} labelPosition='left' inputClassName="w-40" unitPosition="left" />
                </div>
                {/* Right Column - Formulas */}
                <div className="space-y-3 border-l pl-4">
                     <CalculationFormula text="Συντελεστής Δόμησης (Τελικός) * Εμβαδό Οικοπέδου (Ε.Ο.)" />
                     <CalculationFormula text="" />
                     <CalculationFormula text="Μέγιστο Ποσοστό Κάλυψης * Εμβαδό Οικοπέδου (Ε.Ο.)" className="text-blue-600 dark:text-blue-500" />
                     <CalculationFormula text="" />
                     <CalculationFormula text="Μέγιστο Ποσοστό Η/Χ * Μέγιστη Επιτρεπόμενη Δόμηση" className="text-red-500" />
                     <CalculationFormula text="" />
                     <CalculationFormula text="Μέγιστο Ποσοστό Εξωστών * Μέγιστη Επιτρεπόμενη Δόμηση" className="text-fuchsia-600 dark:text-fuchsia-500" />
                     <CalculationFormula text="" />
                     <CalculationFormula text="Μέγ. Ποσοστό Επιτρεπ. Επιφ. Η/Χ Εξωστών * Μέγιστη Επιτρεπ. Δόμηση" className="text-sky-600 dark:text-sky-500" />
                     <CalculationFormula text="" />
                     <CalculationFormula text="Εμβαδόν Οικοπέδου (Ε.Ο.) * Μέγιστος Συντελεστής Όγκου (Σ.Ο.)" className="text-red-600 dark:text-red-500" />
                     <CalculationFormula text="" />
                </div>
            </div>
          </CardContent>
        </Card>
    );
}
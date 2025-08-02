'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

export interface ActualData {
    construction: number;
    plotCoverage: number;
    semiOutdoorArea: number;
    balconyArea: number;
    height: number;
}

export interface CalculatedActualData {
    coveragePercentage: number;
    semiOutdoorPercentage: number;
    balconyPercentage: number;
    combinedPercentage: number;
    combinedArea: number;
    volumeCoefficient: number;
    volumeExploitation: number;
}

interface ActualBuildingDataTabProps {
    actualData: ActualData;
    calculatedData: CalculatedActualData;
    onActualDataChange: (newData: Partial<ActualData>) => void;
}


const FormulaDisplay = ({ text, className, isVisible = true }: { text: string; className?: string; isVisible?: boolean }) => {
    if (!isVisible) return <div className="h-8" />;
    return (
        <div className={cn("h-8 flex items-center justify-end text-sm text-right", className)}>
            <span>{text}</span>
            <span className="ml-2 text-muted-foreground">=</span>
        </div>
    );
};

export function ActualBuildingDataTab({ actualData, calculatedData, onActualDataChange }: ActualBuildingDataTabProps) {
    const formRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onActualDataChange({ [name]: parseFloat(value) || 0 });
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
                <CardTitle className="text-lg text-center">Πραγματοποιούμενα Στοιχεία Δόμησης Οικοπέδου</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex justify-center">
                <div className="flex gap-x-8" ref={formRef}>
                    {/* Left Column - Formulas */}
                    <div className="space-y-3 border-r pr-4">
                        <FormulaDisplay text="" isVisible={false} />
                        <FormulaDisplay text="Πραγματοποιούμενη Κάλυψη Οικοπέδου / Εμβαδό Οικοπέδου (Ε.Ο.)" className="text-blue-600 dark:text-blue-500" />
                        <FormulaDisplay text="" isVisible={false} />
                        <FormulaDisplay text="Πραγματοποιούμενη Επιφάνεια Η/Χ / Πραγματοποιούμενη Δόμηση" className="text-orange-600 dark:text-orange-500" />
                        <FormulaDisplay text="" isVisible={false} />
                        <FormulaDisplay text="Πραγματοποιούμενη Επιφάνεια Εξωστών / Πραγματοποιούμενη Δόμηση" className="text-cyan-600 dark:text-cyan-500" />
                        <FormulaDisplay text="" isVisible={false} />
                        <FormulaDisplay text="Πραγματοποιούμενη Επιφ. Η/Χ, Εξωστών / Πραγματοποιούμενη Δόμηση" className="text-fuchsia-600 dark:text-fuchsia-500" />
                        <FormulaDisplay text="Πραγματ/μενη Επιφάνεια Η/Χ + Πραγματ/μενη Επιφάνεια Εξωστών" className="text-sky-600 dark:text-sky-500" />
                        <FormulaDisplay text="" isVisible={false} />
                        <FormulaDisplay text="Πραγμ. Κατ 'Όγκο Εκμετάλλευση (Ε.Ο.) * (Σ.Ο.) / Εμβαδό Οικοπέδου (Ε.Ο.)" className="text-red-600 dark:text-red-500" />
                        <FormulaDisplay text="" isVisible={false} />
                    </div>
                    {/* Right Column - Fields */}
                    <div className="space-y-3">
                        <FormField label="Πραγματοποιούμενη Δόμηση" id="construction" value={actualData.construction} unit="τ.μ." onChange={handleChange} labelClassName="text-green-600 dark:text-green-500" onEnterPress={handleEnterNavigation} inputClassName="w-40" unitPosition="left" useGrouping />
                        <FormField label="Πραγματοποιούμενο Ποσοστό Κάλυψης" id="coveragePercentage" value={calculatedData.coveragePercentage} unit="%" readOnly labelClassName="text-blue-600 dark:text-blue-500" isPercentage inputClassName="w-40" unitPosition="left" />
                        <FormField label="Πραγματοποιούμενη Κάλυψη Οικοπέδου" id="plotCoverage" value={actualData.plotCoverage} unit="τ.μ." onChange={handleChange} labelClassName="text-blue-600 dark:text-blue-500" onEnterPress={handleEnterNavigation} inputClassName="w-40" unitPosition="left" useGrouping />
                        <FormField label="Πραγματοποιούμενο Ποσοστό Η/Χ" id="semiOutdoorPercentage" value={calculatedData.semiOutdoorPercentage} unit="%" readOnly labelClassName="text-orange-600 dark:text-orange-500" isPercentage inputClassName="w-40" unitPosition="left" />
                        <FormField label="Πραγματοποιούμενη Επιφάνεια Η/Χ" id="semiOutdoorArea" value={actualData.semiOutdoorArea} unit="τ.μ." onChange={handleChange} labelClassName="text-orange-600 dark:text-orange-500" onEnterPress={handleEnterNavigation} inputClassName="w-40" unitPosition="left" useGrouping />
                        <FormField label="Πραγματοποιούμενο Ποσοστό Εξωστών" id="balconyPercentage" value={calculatedData.balconyPercentage} unit="%" readOnly labelClassName="text-cyan-600 dark:text-cyan-500" isPercentage inputClassName="w-40" unitPosition="left" />
                        <FormField label="Πραγματοποιούμενη Επιφάνεια Εξωστών" id="balconyArea" value={actualData.balconyArea} unit="τ.μ." onChange={handleChange} labelClassName="text-cyan-600 dark:text-cyan-500" onEnterPress={handleEnterNavigation} inputClassName="w-40" unitPosition="left" useGrouping />
                        <FormField label="Πραγμ. Ποσοστό Επιτρεπ. Επιφάνεια Η/Χ &amp; Εξωστών" id="combinedPercentage" value={calculatedData.combinedPercentage} unit="%" readOnly labelClassName="text-fuchsia-600 dark:text-fuchsia-500" isPercentage inputClassName="w-40" unitPosition="left" />
                        <FormField label="Πραγματοποιούμενη Επιφάνεια Η/Χ &amp; Εξωστών" id="combinedArea" value={calculatedData.combinedArea} unit="τ.μ." readOnly labelClassName="text-sky-600 dark:text-sky-500" inputClassName="w-40" unitPosition="left" useGrouping />
                        <FormField label="Πραγματοποιούμενος Συντελεστής Όγκου (Σ.Ο.)" id="volumeCoefficient" value={calculatedData.volumeCoefficient} unit="" readOnly labelClassName="text-lime-600 dark:text-lime-500" inputClassName="w-40" />
                        <FormField label="Πραγματοποιούμενη Κατ’ Όγκο Εκμετάλλευση" id="volumeExploitation" value={calculatedData.volumeExploitation} unit="κ.μ." readOnly labelClassName="text-red-600 dark:text-red-500" inputClassName="w-40" unitPosition="left" useGrouping />
                        <FormField label="Πραγματοποιούμενο Ύψος" id="height" value={actualData.height} unit="m" onChange={handleChange} labelClassName="text-indigo-500" onEnterPress={handleEnterNavigation} inputClassName="w-40" unitPosition="left" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

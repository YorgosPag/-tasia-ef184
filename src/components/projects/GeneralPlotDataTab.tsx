'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from './FormField';

export interface PlotData {
    sdNoSocial: number;
    socialFactor: number;
    sdFinal?: number;
    plotArea: number;
}

interface GeneralPlotDataTabProps {
    plotData: PlotData & { sdFinal?: number };
    onPlotDataChange: (newData: Partial<PlotData>) => void;
}

export function GeneralPlotDataTab({ plotData, onPlotDataChange }: GeneralPlotDataTabProps) {
    
    const formRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onPlotDataChange({ [name]: parseFloat(value) || 0 });
    };

    const handleEnterNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const focusable = Array.from(
            formRef.current.querySelectorAll(
                'input:not([readonly]), button, [role="combobox"]'
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
                <CardTitle className="text-lg text-center">Όροι Δόμησης Οικοπέδου</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4" ref={formRef}>
                    {/* Left Column */}
                    <div className="space-y-3">
                        <FormField id="sdNoSocial" label="Συντελεστής Δόμησης (Χωρίς Κοιν. Συντελ.)" value={plotData.sdNoSocial} onChange={handleChange} onEnterPress={handleEnterNavigation} labelPosition='left' inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="socialFactor" label="Κοινωνικός Συντελεστής" value={plotData.socialFactor} onChange={handleChange} onEnterPress={handleEnterNavigation} labelPosition='left' inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="sdFinal" label="Συντελεστής Δόμησης (Τελικός)" value={plotData.sdFinal!} readOnly labelPosition='left' inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="areaCompleteness" label="Εμβαδόν Αρτιότητας" value={0} onChange={() => {}} unit="τ.μ." labelPosition='left' unitPosition='left' onEnterPress={handleEnterNavigation} inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="areaCompletenessDerogation" label="Εμβαδόν Αρτιότητας Κατά Παρέκκλιση" value={0} onChange={() => {}} unit="τ.μ." labelPosition='left' unitPosition='left' onEnterPress={handleEnterNavigation} inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="faceCompleteness" label="Πρόσωπο Αρτιότητας" value={0} onChange={() => {}} unit="μ.μ." labelPosition='left' unitPosition='left' onEnterPress={handleEnterNavigation} inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="faceCompletenessDerogation" label="Πρόσωπο Αρτιότητας Κατά Παρέκκλιση" value={0} onChange={() => {}} unit="μ.μ." labelPosition='left' unitPosition='left' onEnterPress={handleEnterNavigation} inputClassName="w-32" labelClassName="text-muted-foreground" />
                    </div>
                    {/* Right Column */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-[auto_1fr] items-center">
                             <Select defaultValue="yes">
                                <SelectTrigger className="h-8 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Ναι</SelectItem>
                                    <SelectItem value="no">Όχι</SelectItem>
                                </SelectContent>
                            </Select>
                            <Label className="text-sm font-medium text-muted-foreground text-left pl-2">Εντός Ορίων</Label>
                        </div>
                         <div className="grid grid-cols-[auto_1fr] items-center">
                             <Select defaultValue="yes">
                                <SelectTrigger className="h-8 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Ναι</SelectItem>
                                    <SelectItem value="no">Όχι</SelectItem>
                                </SelectContent>
                            </Select>
                            <Label className="text-sm font-medium text-muted-foreground text-left pl-2">Εντός Ζώνης</Label>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-center">
                             <Select defaultValue="yes">
                                <SelectTrigger className="h-8 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Ναι</SelectItem>
                                    <SelectItem value="no">Όχι</SelectItem>
                                </SelectContent>
                            </Select>
                            <Label className="text-sm font-medium text-muted-foreground text-left pl-2">Πυλωτή</Label>
                        </div>
                         <div className="grid grid-cols-[auto_1fr] items-center">
                             <Select defaultValue="no">
                                <SelectTrigger className="h-8 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Ναι</SelectItem>
                                    <SelectItem value="no">Όχι</SelectItem>
                                </SelectContent>
                            </Select>
                            <Label className="text-sm font-medium text-muted-foreground text-left pl-2">Στέγη</Label>
                        </div>
                        
                        <FormField id="maxRoofHeight" label="Μέγιστο Ύψος Στέγης" value={0} onChange={() => {}} unit="μ.μ." labelPosition='right' unitPosition='left' onEnterPress={handleEnterNavigation} inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="maxRoofSlope" label="Μέγιστη Κλίση Στέγης" value={0} onChange={() => {}} unit="%" labelPosition='right' unitPosition='left' onEnterPress={handleEnterNavigation} inputClassName="w-32" labelClassName="text-muted-foreground" />
                        <FormField id="plotArea" label="Εμβαδόν Οικοπέδου (Ε.Ο.)" value={plotData.plotArea} onChange={handleChange} unit="τ.μ." labelPosition='right' unitPosition='left' useGrouping={true} onEnterPress={handleEnterNavigation} inputClassName="w-32" labelClassName="text-muted-foreground" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
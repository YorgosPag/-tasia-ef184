'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from './FormField';

export function OtherDataTab() {
    const formRef = useRef<HTMLDivElement>(null);
    const [financialData, setFinancialData] = useState({
        salePricePerSqm: 0,
        costPerSqm: 0,
        realizedValue: 3922222,
        financing: 0,
        grossOutsideStairwell: 0,
        relatedArea: 0,
        actualConstructionArea: 0,
        estimatedCost: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFinancialData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
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


    const calculatedData = useMemo(() => {
        const completionAmount = financialData.estimatedCost - financialData.realizedValue;
        const progressPercentage = financialData.estimatedCost > 0 
            ? (financialData.realizedValue / financialData.estimatedCost)
            : 0;
        return { completionAmount, progressPercentage };
    }, [financialData.estimatedCost, financialData.realizedValue]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Άλλα Στοιχεία</CardTitle>
                <CardDescription>
                    Οικονομικά στοιχεία και παρακολούθηση της προόδου του έργου.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4" ref={formRef}>
                    {/* Left Column */}
                    <div className="space-y-4">
                        <FormField 
                            id="salePricePerSqm" 
                            label="Τιμή Πώλησης Ανά τ.μ." 
                            unit="€" 
                            value={financialData.salePricePerSqm} 
                            onChange={handleChange}
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Η τιμή πώλησης ανά τετραγωνικό μέτρο."
                            labelPosition="left"
                            inputClassName="w-48"
                            useGrouping
                        />
                        <FormField 
                            id="costPerSqm" 
                            label="Κόστος Ανά τ.μ. Δόμησης" 
                            unit="€" 
                            value={financialData.costPerSqm} 
                            onChange={handleChange} 
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Το κόστος κατασκευής ανά τετραγωνικό μέτρο δόμησης."
                            labelPosition="left"
                            inputClassName="w-48"
                            useGrouping
                        />
                        <FormField 
                            id="realizedValue" 
                            label="Αξία Πραγματοποιηθέντος Έργου" 
                            unit="€" 
                            value={financialData.realizedValue} 
                            onChange={handleChange} 
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Η τρέχουσα αξία του έργου που έχει ολοκληρωθεί."
                            labelPosition="left"
                            inputClassName="w-48"
                            useGrouping
                        />
                        <FormField 
                            id="completionAmount" 
                            label="Απαιτούμενο Ποσό Αποπεράτωσης" 
                            unit="€" 
                            value={calculatedData.completionAmount} 
                            readOnly 
                            tooltipText="Υπολογίζεται αυτόματα: Εκτιμώμενο Κόστος - Αξία Πραγματοποιηθέντος"
                            labelPosition="left"
                            inputClassName="w-48"
                            useGrouping
                        />
                        <FormField 
                            id="financing" 
                            label="Χρηματοδότηση Έργου" 
                            unit="€" 
                            value={financialData.financing} 
                            onChange={handleChange} 
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Το ποσό της χρηματοδότησης για το έργο."
                            labelPosition="left"
                            inputClassName="w-48"
                            useGrouping
                        />
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                         <FormField 
                            id="grossOutsideStairwell" 
                            label="Μικτά Εκτός Κλιμακοστασίου" 
                            unit="τ.μ." 
                            value={financialData.grossOutsideStairwell} 
                            onChange={handleChange} 
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Το συνολικό μικτό εμβαδόν εκτός του κλιμακοστασίου."
                            labelPosition="left"
                            inputClassName="w-48"
                            unitPosition="left"
                        />
                         <FormField 
                            id="relatedArea" 
                            label="Εμβαδόν Που Ανάγεται" 
                            unit="τ.μ." 
                            value={financialData.relatedArea} 
                            onChange={handleChange} 
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Επιπλέον εμβαδόν που προστίθεται ή ανάγεται."
                            labelPosition="left"
                            inputClassName="w-48"
                            unitPosition="left"
                        />
                         <FormField 
                            id="actualConstructionArea" 
                            label="Εμβαδόν Πραγμ. Δόμησης & Αναγωγής" 
                            unit="τ.μ." 
                            value={financialData.actualConstructionArea} 
                            onChange={handleChange} 
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Το τελικό εμβαδόν της πραγματικής δόμησης συμπεριλαμβανομένης της αναγωγής."
                            labelPosition="left"
                            inputClassName="w-48"
                            unitPosition="left"
                        />
                         <FormField 
                            id="estimatedCost" 
                            label="Εκτιμώμενο Κόστος Έργου" 
                            unit="€" 
                            value={financialData.estimatedCost} 
                            onChange={handleChange} 
                            onEnterPress={handleEnterNavigation}
                            tooltipText="Το συνολικό εκτιμώμενο κόστος για την ολοκλήρωση του έργου."
                            labelPosition="left"
                            inputClassName="w-48"
                            useGrouping
                        />
                         <FormField 
                            id="progressPercentage" 
                            label="Ποσοστό Προόδου Έργου" 
                            unit="%" 
                            value={calculatedData.progressPercentage} 
                            readOnly 
                            tooltipText="Υπολογίζεται αυτόματα: (Αξία Πραγματοποιηθέντος / Εκτιμώμενο Κόστος) * 100"
                            labelPosition="left"
                            inputClassName="w-48"
                            isPercentage
                            unitPosition="left"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

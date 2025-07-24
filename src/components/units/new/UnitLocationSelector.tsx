
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MULTI_FLOOR_TYPES } from '@/lib/unit-helpers';

export function UnitLocationSelector({ form, locationState, isMultiFloorAllowed }: { form: UseFormReturn<any>, locationState: any, isMultiFloorAllowed: boolean }) {
    const {
        selectedCompany, setSelectedCompany, filteredProjects,
        selectedProject, setSelectedProject, filteredBuildings,
        selectedBuilding, setSelectedBuilding, floors, isLoadingFloors
    } = locationState;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <FormItem>
                <FormLabel>Εταιρεία</FormLabel>
                <Select onValueChange={setSelectedCompany} value={selectedCompany}>
                    <SelectTrigger><SelectValue placeholder="Επιλέξτε Εταιρεία..."/></SelectTrigger>
                    <SelectContent>{locationState.companies.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
            </FormItem>
            <FormItem>
                <FormLabel>Έργο</FormLabel>
                <Select onValueChange={setSelectedProject} value={selectedProject} disabled={!selectedCompany || filteredProjects.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Επιλέξτε Έργο..."/></SelectTrigger>
                    <SelectContent>{filteredProjects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
            </FormItem>
            <FormItem>
                <FormLabel>Κτίριο</FormLabel>
                <Select onValueChange={setSelectedBuilding} value={selectedBuilding} disabled={!selectedProject || filteredBuildings.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Επιλέξτε Κτίριο..."/></SelectTrigger>
                    <SelectContent>{filteredBuildings.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.address}</SelectItem>)}</SelectContent>
                </Select>
            </FormItem>
            <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Τύπος</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBuilding}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε τύπο..."/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Διαμέρισμα">Διαμέρισμα</SelectItem>
                            <SelectItem value="Στούντιο">Στούντιο</SelectItem>
                            <SelectItem value="Γκαρσονιέρα">Γκαρσονιέρα</SelectItem>
                            <SelectItem value="Μεζονέτα">Μεζονέτα</SelectItem>
                            <SelectItem value="Κατάστημα">Κατάστημα</SelectItem>
                            <SelectItem value="Other">Άλλο</SelectItem>
                        </SelectContent>
                    </Select>
                <FormMessage />
                </FormItem>
            )} />

            <FormField
                control={form.control}
                name="floorIds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Όροφος/οι</FormLabel>
                        {isMultiFloorAllowed ? (
                            <MultiSelect
                                options={floors}
                                selected={field.value}
                                onChange={field.onChange}
                                placeholder="Επιλέξτε ορόφους..."
                                disabled={!form.getValues('type') || floors.length === 0}
                                isLoading={isLoadingFloors}
                            />
                        ) : (
                            <Select onValueChange={(value) => field.onChange(value ? [value] : [])} value={field.value?.[0] || ''} disabled={!form.getValues('type') || floors.length === 0}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε όροφο..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {isLoadingFloors ? (
                                        <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
                                    ) : (
                                        floors.map((floor: any) => <SelectItem key={floor.value} value={floor.value}>{floor.label}</SelectItem>)
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="levelSpan"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Πλήθος επιλεγμένων ορόφων</FormLabel>
                        <FormControl><Input type="number" readOnly {...field} className="bg-muted" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

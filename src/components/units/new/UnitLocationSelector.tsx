
"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Loader2, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/use-data-store";

export function UnitLocationSelector({
  form,
  locationState,
  isMultiFloorAllowed,
  onQuickCreate,
}: {
  form: UseFormReturn<any>;
  locationState: any;
  isMultiFloorAllowed: boolean;
  onQuickCreate: (entity: "company" | "project" | "building" | "floor") => void;
}) {
  const {
    companies,
    selectedCompany,
    setSelectedCompany,
    filteredProjects,
    selectedProject,
    setSelectedProject,
    filteredBuildings,
    selectedBuilding,
    setSelectedBuilding,
    floors,
    isLoadingFloors,
  } = locationState;

  const renderSelectWithAddButton = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    options: {
      id: string;
      name?: string;
      title?: string;
      address?: string;
      level?: string;
    }[],
    placeholder: string,
    disabled: boolean,
    entityType: "company" | "project" | "building" | "floor",
  ) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center gap-2">
        <Select onValueChange={onChange} value={value} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.name || opt.title || opt.address || opt.level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onQuickCreate(entityType)}
          disabled={entityType !== "company" && disabled}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </FormItem>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
      {renderSelectWithAddButton(
        "Εταιρεία",
        selectedCompany,
        setSelectedCompany,
        companies,
        "Επιλέξτε Εταιρεία...",
        false,
        "company",
      )}
      {renderSelectWithAddButton(
        "Έργο",
        selectedProject,
        setSelectedProject,
        filteredProjects,
        "Επιλέξτε Έργο...",
        !selectedCompany,
        "project",
      )}
      {renderSelectWithAddButton(
        "Κτίριο",
        selectedBuilding,
        setSelectedBuilding,
        filteredBuildings,
        "Επιλέξτε Κτίριο...",
        !selectedProject,
        "building",
      )}

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Τύπος</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedBuilding}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε τύπο..." />
                </SelectTrigger>
              </FormControl>
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
        )}
      />

      <FormField
        control={form.control}
        name="floorIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Όροφος/οι</FormLabel>
            <div className="flex items-center gap-2">
              {isMultiFloorAllowed ? (
                <MultiSelect
                  options={floors}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Επιλέξτε ορόφους..."
                  disabled={!form.getValues("type") || floors.length === 0}
                  isLoading={isLoadingFloors}
                  className="flex-1"
                />
              ) : (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? [value] : [])
                  }
                  value={field.value?.[0] || ""}
                  disabled={!form.getValues("type") || floors.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Επιλέξτε όροφο..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingFloors ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      floors.map((floor: any) => (
                        <SelectItem key={floor.value} value={floor.value}>
                          {floor.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onQuickCreate("floor")}
                disabled={!selectedBuilding}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
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
            <FormControl>
              <Input type="number" readOnly {...field} className="bg-muted" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

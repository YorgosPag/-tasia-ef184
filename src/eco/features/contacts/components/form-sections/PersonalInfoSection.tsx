
'use client';

import { FormTextField } from "@/eco/components/form/FormTextField";
import { FormDateField } from "@/eco/components/form/FormDateField";
import { FormSelectField } from "@/eco/components/form/FormSelectField";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PersonalInfoSectionProps {
  control: Control<any>;
  entityType: 'Φυσικό Πρόσωπο' | 'Νομικό Πρόσωπο' | 'Δημ. Υπηρεσία';
}

export function PersonalInfoSection({ control, entityType }: PersonalInfoSectionProps) {
  const genderOptions = [
    { id: 'male', value: 'Άνδρας' },
    { id: 'female', value: 'Γυναίκα' },
    { id: 'other', value: 'Άλλο' },
  ];

  return (
    <div className="space-y-4 pt-4">
        <FormField
            control={control}
            name="entityType"
            render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Τύπος Οντότητας</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Φυσικό Πρόσωπο" />
                    </FormControl>
                    <FormLabel className="font-normal">Φυσικό Πρόσωπο</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Νομικό Πρόσωπο" />
                    </FormControl>
                    <FormLabel className="font-normal">Νομικό Πρόσωπο</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Δημ. Υπηρεσία" />
                    </FormControl>
                    <FormLabel className="font-normal">Δημ. Υπηρεσία</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormTextField control={control} name="name" label="Επωνυμία / Ονοματεπώνυμο" placeholder="Επωνυμία εταιρείας ή ονοματεπώνυμο"/>
        
        {entityType === 'Φυσικό Πρόσωπο' && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <FormTextField control={control} name="firstName" label="Όνομα" />
              <FormTextField control={control} name="lastName" label="Επώνυμο" />
              <FormTextField control={control} name="fatherName" label="Όνομα Πατέρα" />
              <FormTextField control={control} name="motherName" label="Όνομα Μητέρας" />
              <FormDateField control={control} name="birthDate" label="Ημ/νία Γέννησης" fromYear={1930} toYear={new Date().getFullYear()} />
              <FormTextField control={control} name="birthPlace" label="Τόπος Γέννησης" />
              <FormSelectField control={control} name="gender" label="Φύλο" options={genderOptions} />
              <FormTextField control={control} name="nationality" label="Υπηκοότητα" />
            </div>
            <FormTextField control={control} name="photoUrl" label="Φωτογραφία (URL)" placeholder="https://example.com/photo.jpg"/>
          </>
        )}
      </div>
  );
}

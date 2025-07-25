'use client';

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FormTextField } from "@/eco/components/form/FormTextField";
import { FormDateField } from "@/eco/components/form/FormDateField";
import { FormSelectField } from "@/eco/components/form/FormSelectField";
import { Control } from "react-hook-form";

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
    <AccordionItem value="personal-info">
      <AccordionTrigger>Προσωπικά Στοιχεία</AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
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
      </AccordionContent>
    </AccordionItem>
  );
}

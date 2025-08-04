"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Unit } from "@/hooks/use-unit-details";
import { unitContractSchema, FormValues } from "@/lib/validation/schemas/unitContractSchema";


export function useContractsForm(unit: Unit) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contracts: unit.contracts || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contracts",
    keyName: "fieldId", 
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const unitRef = doc(db, "units", unit.id);
      await updateDoc(unitRef, { contracts: data.contracts });
      toast({ title: "Επιτυχία", description: "Τα συμβόλαια αποθηκεύτηκαν." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Η αποθήκευση απέτυχε: ${error.message}`,
      });
    }
  };
  
  return { form, fields, append, remove, onSubmit };
}

const formSchema = z.object({
  contracts: z.array(unitContractSchema),
});

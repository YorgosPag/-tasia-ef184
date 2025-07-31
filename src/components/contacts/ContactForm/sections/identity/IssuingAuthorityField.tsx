"use client";

import React, { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { ContactFormValues } from "@/lib/validation/contactSchema";
import { CreatableCombobox } from "@/components/common/autocomplete/CreatableCombobox";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface IssuingAuthorityFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export function IssuingAuthorityField({ form }: IssuingAuthorityFieldProps) {
  const { toast } = useToast();
  const [issuingAuthorityOptions, setIssuingAuthorityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [listId, setListId] = useState<string | null>("iGOjn86fcktREwMeDFPz"); // Hardcode the ID

  useEffect(() => {
    if (!listId) return;

    const itemsQuery = query(
      collection(db, "tsia-custom-lists", listId, "tsia-items"),
      orderBy("value"),
    );
    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const options = snapshot.docs.map((doc) => ({
        value: doc.data().value,
        label: doc.data().value,
      }));
      setIssuingAuthorityOptions(options);
    });

    return () => unsubscribe();
  }, [listId]);

  const handleCreateIssuingAuthority = async (newValue: string) => {
    if (!listId) return null;
    if (!newValue.trim()) return null;

    try {
      await addDoc(collection(db, "tsia-custom-lists", listId, "tsia-items"), {
        value: newValue,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Επιτυχία",
        description: `Η αρχή "${newValue}" προστέθηκε.`,
      });
      return newValue;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η προσθήκη της νέας αρχής.",
      });
      return null;
    }
  };

  return (
    <FormField
      control={form.control}
      name="identity.issuingAuthority"
      render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormLabel className="w-40 text-right">Εκδ. Αρχή</FormLabel>
          <div className="flex-1">
            <CreatableCombobox
              options={issuingAuthorityOptions}
              value={field.value || ""}
              onChange={field.onChange}
              onCreate={handleCreateIssuingAuthority}
              placeholder="Επιλέξτε ή δημιουργήστε αρχή..."
            />
            <FormDescription>
              Επιλέξτε αρχή ή πληκτρολογήστε για να προσθέσετε νέα.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

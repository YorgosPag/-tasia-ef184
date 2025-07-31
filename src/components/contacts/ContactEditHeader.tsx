"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import type { ContactFormValues } from "@/lib/validation/contactSchema";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface ContactEditHeaderProps {
  contactName: string;
  isSubmitting: boolean;
  isDirty: boolean;
  onBack: () => void;
  form: UseFormReturn<ContactFormValues>;
}

export function ContactEditHeader({
  contactName,
  isSubmitting,
  isDirty,
  onBack,
  form,
}: ContactEditHeaderProps) {
  return (
    <div className="sticky top-0 bg-background py-4 z-10 border-b mb-4">
      {/* Top Bar: Back and Save */}
      <div className="flex items-center justify-between px-1">
        <div className="flex-1">
          <Button type="button" variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Πίσω στις Επαφές
          </Button>
        </div>

        <div className="flex-1 text-center">
          <CardTitle>Επεξεργασία Επαφής</CardTitle>
          <CardDescription>
            Ενημερώστε τα παρακάτω πεδία για να επεξεργαστείτε την επαφή.
          </CardDescription>
        </div>

        <div className="flex-1 flex justify-end">
          <Button
            type="submit"
            form="contact-form"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Αποθήκευση Αλλαγών
          </Button>
        </div>
      </div>
    </div>
  );
}

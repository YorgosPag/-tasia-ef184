"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWatchedFields } from "../hooks/useWatchedFields";
import type { ContactFormProps } from "../types";

export function RegistrationInfoSection({
  form,
}: Pick<ContactFormProps, "form">) {
  const { registrationType, branchType } = useWatchedFields(form);

  return (
    <Card className="relative border-muted">
      <CardHeader>
        <CardTitle className="text-lg">Στοιχεία Καταχώρισης</CardTitle>
        <CardDescription>
          🛈 Οι παρακάτω πληροφορίες αφορούν την αρχική εγγραφή της εταιρείας στο
          Γ.Ε.ΜΗ.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          name="job.initialRegistrationDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ημερομηνία Πρώτης Καταχώρισης</FormLabel>
              <FormControl>
                <Input value={field.value || "—"} disabled />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <div>
            <FormLabel>Τρόπος Εγγραφής</FormLabel>
            <Badge variant="outline" className="block w-fit mt-2">
              {registrationType || "—"}
            </Badge>
          </div>
          <div>
            <FormLabel>Υποκατάστημα / Μητρική</FormLabel>
            <Badge variant="outline" className="block w-fit mt-2">
              {branchType || "—"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

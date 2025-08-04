"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import type { Unit } from "@/hooks/use-unit-details";
import { useContractsForm } from "@/hooks/units/useContractsForm";
import { useContactsOptions } from "@/hooks/units/useContactsOptions";
import { ContractStageForm } from "./contracts/ContractStageForm";

interface UnitContractsTabProps {
  unit: Unit;
}

export default function UnitContractsTab({ unit }: UnitContractsTabProps) {
  const { contacts, isLoading: isLoadingContacts } = useContactsOptions();
  const { form, fields, append, remove, onSubmit } = useContractsForm(unit);

  const addNewContract = () => {
    append({
      clientName: "",
      status: "Προσύμφωνο",
      preliminary: {},
      final: {},
      settlement: {},
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Συμβόλαια Ακινήτου</CardTitle>
          <Button type="button" size="sm" onClick={addNewContract}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Νέο Συμβόλαιο
          </Button>
        </div>
        <CardDescription>
          Διαχειριστείτε τα συμβόλαια που σχετίζονται με την πώληση αυτού του
          ακινήτου.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fields.length > 0 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion
                type="multiple"
                defaultValue={fields.map((f) => f.id)}
              >
                {fields.map((field, index) => (
                  <AccordionItem
                    key={field.id}
                    value={field.id}
                  >
                    <div className="flex w-full items-center">
                      <AccordionTrigger className="flex-1">
                        <span>
                          Πελάτης:{" "}
                          {form.watch(`contracts.${index}.clientName`) ||
                            "(Χωρίς όνομα)"}
                        </span>
                      </AccordionTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <AccordionContent className="space-y-4 p-2">
                      <ContractStageForm
                        nestIndex={index}
                        contacts={contacts}
                        control={form.control}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Αποθήκευση Συμβολαίων
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Δεν υπάρχουν συμβόλαια για αυτό το ακίνητο.</p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={addNewContract}
            >
              Προσθήκη Πρώτου Συμβολαίου
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

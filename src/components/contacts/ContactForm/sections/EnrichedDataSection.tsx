"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function EnrichedDataSection({ form }: { form: any }) {
  return (
    <Card className="relative border-muted">
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-4">
          🛈 Τα παρακάτω στοιχεία θα συμπληρωθούν αυτόματα από το Γ.Ε.ΜΗ. μόλις
          ολοκληρωθεί η σύνδεση.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
          <FormItem>
            <FormLabel>Επωνυμία (Αγγλικά)</FormLabel>
            <FormControl>
              <Input disabled placeholder="-" />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Διακριτικός Τίτλος (Αγγλικά)</FormLabel>
            <FormControl>
              <Input disabled placeholder="-" />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Ιστοσελίδα</FormLabel>
            <FormControl>
              <Input
                disabled
                placeholder="—"
                value={form.watch("job.url") || ""}
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Email Επιχείρησης</FormLabel>
            <FormControl>
              <Input
                disabled
                placeholder="—"
                value={form.watch("job.email") || ""}
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Ημερομηνία Σύστασης</FormLabel>
            <FormControl>
              <Input disabled placeholder="-" />
            </FormControl>
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
}

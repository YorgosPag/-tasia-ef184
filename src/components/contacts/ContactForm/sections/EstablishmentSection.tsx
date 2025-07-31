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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EstablishmentSection() {
  return (
    <Card className="relative border-muted">
      <CardHeader>
        <CardTitle className="text-lg">Στοιχεία Σύστασης (ΥΜΣ)</CardTitle>
        <CardDescription>
          🛈 Τα στοιχεία της σύστασης θα εμφανιστούν αυτόματα από το Γ.Ε.ΜΗ.
          μόλις ολοκληρωθεί η σύνδεση με την ΥΜΣ.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-md opacity-50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Κωδικός Δημοσίευσης (ΚΑΔ)</TableHead>
                <TableHead>Σύνδεσμος Εγγράφου</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input disabled placeholder="-" className="h-8" />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" disabled>
                    Λήψη
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

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
import { Input } from "@/components/ui/input";

export function ActivitiesSection() {
  return (
    <Card className="relative border-muted">
      <CardHeader>
        <CardTitle className="text-lg">Δραστηριότητες (ΚΑΔ)</CardTitle>
        <CardDescription>
          🛈 Τα παρακάτω στοιχεία αντλούνται από το Γ.Ε.ΜΗ. και θα συμπληρωθούν
          αυτόματα μόλις ολοκληρωθεί η σύνδεση.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-md opacity-50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Κωδικός ΚΑΔ</TableHead>
                <TableHead>Περιγραφή</TableHead>
                <TableHead>Τύπος</TableHead>
                <TableHead>Από</TableHead>
                <TableHead>Έως</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input disabled placeholder="-" className="h-8" />
                </TableCell>
                <TableCell>
                  <Input disabled placeholder="-" className="h-8" />
                </TableCell>
                <TableCell>
                  <Input disabled placeholder="-" className="h-8" />
                </TableCell>
                <TableCell>
                  <Input disabled placeholder="-" className="h-8" />
                </TableCell>
                <TableCell>
                  <Input disabled placeholder="-" className="h-8" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

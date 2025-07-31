"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function ContractsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Συμβόλαια</h1>
        <Button onClick={() => alert("New Contract form!")}>
          <PlusCircle className="mr-2" />
          Νέο Συμβόλαιο
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Λίστα Συμβολαίων</CardTitle>
          <CardDescription>Διαχείριση όλων των συμβολαίων.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="mt-4 text-lg font-medium">
              Δεν έχουν καταγραφεί συμβόλαια
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Καταχωρήστε το πρώτο συμβόλαιο για να ξεκινήσετε.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

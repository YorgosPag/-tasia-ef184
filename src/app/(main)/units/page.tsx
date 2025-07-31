"use client";

import { useState, useMemo } from "react";
import { useUnits } from "@/hooks/use-units";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UnitCard } from "@/components/units/UnitCard";
import { useRouter } from "next/navigation";

export default function UnitsPage() {
  const { data: units = [], isLoading } = useUnits();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredUnits = useMemo(() => {
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.type?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [units, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ακίνητα
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/units/new")}>
            <PlusCircle className="mr-2" />
            Νέο Ακίνητο
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Αναζήτηση σε όνομα, κωδικό, τύπο..."
          className="pl-10 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      ) : filteredUnits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUnits.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="mt-4 text-lg font-medium">Δεν βρέθηκαν ακίνητα</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "Δοκιμάστε διαφορετική αναζήτηση."
              : "Δημιουργήστε το πρώτο σας ακίνητο."}
          </p>
        </div>
      )}
    </div>
  );
}

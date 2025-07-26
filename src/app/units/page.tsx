'use client';

import React from 'react';
import { useUnits, Unit } from '@/tasia/hooks/use-units';
import { UnitCard } from '@/tasia/components/units/UnitCard';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function UnitsPage() {
  const { data: units = [], isLoading } = useUnits();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ακίνητα
        </h1>
      </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Αναζήτηση σε όνομα, κωδικό, τύπο..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
       </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUnits.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
       { !isLoading && filteredUnits.length === 0 && (
         <div className="text-center col-span-full py-10">
            <p className="text-muted-foreground">Δεν βρέθηκαν ακίνητα που να ταιριάζουν στα κριτήρια.</p>
         </div>
       )}
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { useUnits } from '@/tasia/hooks/use-units';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { UnitCard } from '@/tasia/components/units/UnitCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function UnitsPage() {
  const { data: units = [], isLoading } = useUnits();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUnits = useMemo(() => {
    return units.filter(unit => 
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [units, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Ακίνητα</h1>
        <Button asChild>
            <Link href="/units/new">
                <PlusCircle className="mr-2" />
                Νέο Ακίνητο
            </Link>
        </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
             <Skeleton key={i} className="h-96 w-full" />
          ))
        ) : filteredUnits.length > 0 ? (
          filteredUnits.map(unit => (
            <UnitCard key={unit.id} unit={unit} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">Δεν βρέθηκαν ακίνητα.</p>
        )}
      </div>

    </div>
  );
}
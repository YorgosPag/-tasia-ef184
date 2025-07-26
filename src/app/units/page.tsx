
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUnits } from '@/tasia/hooks/use-units';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { UnitCard } from '@/tasia/components/units/UnitCard';

const ALL_STATUSES: ReturnType<typeof useUnits>['data'][number]['status'][] = [
  'Διαθέσιμο',
  'Προς Ενοικίαση',
  'Κρατημένο',
  'Πωλημένο',
  'Οικοπεδούχος',
];

export default function UnitsPage() {
  const router = useRouter();
  const { data: units = [], isLoading } = useUnits();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('price-asc');

  const filteredAndSortedUnits = useMemo(() => {
    let filtered = units;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((unit) => unit.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (unit) =>
          unit.name.toLowerCase().includes(query) ||
          (unit.identifier && unit.identifier.toLowerCase().includes(query)) ||
          (unit.type && unit.type.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;

        switch (sortOrder) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'area-asc': return (a.area || 0) - (b.area || 0);
            case 'area-desc': return (b.area || 0) - (a.area || 0);
            case 'date-desc': 
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : 0;
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : 0;
                return (dateB as number) - (dateA as number);
            default: return 0;
        }
    });
  }, [units, searchQuery, statusFilter, sortOrder]);
  
  const handleAddNewUnit = () => {
    // This will likely navigate to a dedicated "new unit" page in the future.
    // For now, we can log it or open a dialog.
    alert("Η φόρμα δημιουργίας νέου ακινήτου θα υλοποιηθεί εδώ.");
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ευρετήριο Ακινήτων
        </h1>
         <Button onClick={handleAddNewUnit} disabled>
          <PlusCircle className="mr-2" />
          Νέο Ακίνητο
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Αναζήτηση..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Φίλτρο κατάστασης" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                {ALL_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
            </SelectContent>
        </Select>
         <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ταξινόμηση" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="price-asc">Τιμή (Αύξουσα)</SelectItem>
                <SelectItem value="price-desc">Τιμή (Φθίνουσα)</SelectItem>
                <SelectItem value="area-desc">Εμβαδόν (Φθίνουσα)</SelectItem>
                <SelectItem value="area-asc">Εμβαδόν (Αύξουσα)</SelectItem>
                <SelectItem value="date-desc">Πιο πρόσφατα</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {isLoading ? (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
        </div>
      ) : filteredAndSortedUnits.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedUnits.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
            ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 rounded-lg border-2 border-dashed">
            <p className="text-center text-muted-foreground">
                Δεν βρέθηκαν ακίνητα που να ταιριάζουν με τα κριτήρια.
            </p>
        </div>
      )}
    </div>
  );
}

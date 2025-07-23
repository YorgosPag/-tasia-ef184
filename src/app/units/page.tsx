
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection, Timestamp, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Download, ListFilter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { exportToJson } from '@/lib/exporter';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ALL_STATUSES } from '@/components/floor-plan/utils';
import { getStatusClass } from '@/lib/unit-helpers';

interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  floorIds: string[];
  levelSpan?: string;
  buildingId: string;
  createdAt: any;
  area?: number;
  price?: number;
  amenities?: string[];
}

async function fetchUnits(): Promise<Unit[]> {
  const unitsCollection = collection(db, 'units');
  const snapshot = await getDocs(query(unitsCollection));
  const units = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
  return units;
}

export function useUnits() {
  return useQuery({
      queryKey: ['units'],
      queryFn: fetchUnits,
  });
}


export default function UnitsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: ALL_STATUSES,
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    amenities: '',
  });

  const { data: units = [], isLoading, isError } = useUnits();

  // Effect to sync filters state with URL params on initial load
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    
    const newFilters = { ...filters };
    let filtersChanged = false;

    if (statusParam) {
      newFilters.status = statusParam.split(',') as Unit['status'][];
      filtersChanged = true;
    }
     if (minPriceParam) {
      newFilters.minPrice = minPriceParam;
      filtersChanged = true;
    }
     if (maxPriceParam) {
      newFilters.maxPrice = maxPriceParam;
      filtersChanged = true;
    }

    if (filtersChanged) {
        setFilters(newFilters);
        setIsFiltersOpen(true);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount

  const handleFilterChange = (key: keyof typeof filters, value: string | string[]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (status: Unit['status'], checked: boolean) => {
    const newStatus = checked
        ? [...filters.status, status]
        : filters.status.filter(s => s !== status);
    handleFilterChange('status', newStatus);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
        status: ALL_STATUSES,
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: '',
        amenities: '',
    });
    // Also remove from URL
    router.push('/units');
  }

  const handleRowClick = (unitId: string) => {
    router.push(`/units/${unitId}`);
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'dd/MM/yyyy');
    }
    return 'Άγνωστη ημερομηνία';
  };
  
  const filteredUnits = useMemo(() => {
    if (!units) return [];
    
    const minPrice = parseFloat(filters.minPrice);
    const maxPrice = parseFloat(filters.maxPrice);
    const minArea = parseFloat(filters.minArea);
    const maxArea = parseFloat(filters.maxArea);
    const amenitiesQuery = filters.amenities.toLowerCase().split(',').map(a => a.trim()).filter(Boolean);

    return units.filter((unit) => {
        const query = searchQuery.toLowerCase();
        
        // General Search Query
        const matchesSearch = (
            unit.name.toLowerCase().includes(query) ||
            (unit.type && unit.type.toLowerCase().includes(query)) ||
            unit.identifier.toLowerCase().includes(query)
        );

        // Status Filter
        const matchesStatus = filters.status.length === 0 || filters.status.length === ALL_STATUSES.length || filters.status.includes(unit.status);
        
        // Price Filter
        const matchesPrice = (
            (isNaN(minPrice) || (unit.price && unit.price >= minPrice)) &&
            (isNaN(maxPrice) || (unit.price && unit.price <= maxPrice))
        );
        
        // Area Filter
        const matchesArea = (
            (isNaN(minArea) || (unit.area && unit.area >= minArea)) &&
            (isNaN(maxArea) || (unit.area && unit.area <= maxArea))
        );
        
        // Amenities Filter
        const matchesAmenities = amenitiesQuery.length === 0 || 
            amenitiesQuery.every(amenity => 
                unit.amenities?.some(ua => ua.toLowerCase().includes(amenity))
            );

        return matchesSearch && matchesStatus && matchesPrice && matchesArea && matchesAmenities;
    });
  }, [units, searchQuery, filters]);

  const handleExport = () => {
    const dataToExport = filteredUnits.map(u => ({
      ...u,
      createdAt: formatDate(u.createdAt),
    }));
    exportToJson(dataToExport, 'units');
  };

  const activeFilterCount = useMemo(() => {
      let count = 0;
      if (searchQuery) count++;
      if (filters.status.length > 0 && filters.status.length < ALL_STATUSES.length) count++;
      if (filters.minPrice) count++;
      if (filters.maxPrice) count++;
      if (filters.minArea) count++;
      if (filters.maxArea) count++;
      if (filters.amenities) count++;
      return count;
  }, [searchQuery, filters]);

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ακίνητα (Units)
        </h1>
        <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredUnits.length === 0}>
            <Download className="mr-2"/>
            Εξαγωγή σε JSON
        </Button>
      </div>

       <div className="space-y-4 p-4 border rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Αναζήτηση βάση ονόματος, τύπου, κωδικού..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="text-sm">
                        <ListFilter className="mr-2 h-4 w-4"/>
                        Προηγμένα Φίλτρα
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
                        )}
                    </Button>
                </CollapsibleTrigger>
                {activeFilterCount > 0 && (
                    <Button variant="secondary" size="sm" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Καθαρισμός ({activeFilterCount})
                    </Button>
                )}
            </div>
            <CollapsibleContent className="mt-4 space-y-6 animate-in fade-in-0">
                <div className="space-y-2">
                    <Label>Κατάσταση</Label>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {ALL_STATUSES.map(status => (
                            <div key={status} className="flex items-center gap-2">
                                <Checkbox
                                    id={`status-${status}`}
                                    checked={filters.status.includes(status)}
                                    onCheckedChange={(checked) => handleStatusChange(status, !!checked)}
                                />
                                <Label htmlFor={`status-${status}`} className="font-normal">{status}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="minPrice">Ελάχιστη Τιμή (€)</Label>
                        <Input id="minPrice" type="number" placeholder="π.χ. 100000" value={filters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="maxPrice">Μέγιστη Τιμή (€)</Label>
                        <Input id="maxPrice" type="number" placeholder="π.χ. 500000" value={filters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="minArea">Ελάχιστο Εμβαδόν (τ.μ.)</Label>
                        <Input id="minArea" type="number" placeholder="π.χ. 50" value={filters.minArea} onChange={e => handleFilterChange('minArea', e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="maxArea">Μέγιστο Εμβαδόν (τ.μ.)</Label>
                        <Input id="maxArea" type="number" placeholder="π.χ. 150" value={filters.maxArea} onChange={e => handleFilterChange('maxArea', e.target.value)} />
                     </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="amenities">Παροχές (χωρισμένες με κόμμα)</Label>
                    <Input id="amenities" placeholder="π.χ. τζάκι, κήπος" value={filters.amenities} onChange={e => handleFilterChange('amenities', e.target.value)}/>
                </div>
            </CollapsibleContent>
          </Collapsible>
       </div>


      <Card>
        <CardHeader>
          <CardTitle>Αποτελέσματα ({filteredUnits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
             <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των δεδομένων.</p>
          ) : filteredUnits.length > 0 ? (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Κωδικός</TableHead>
                    <TableHead>Όνομα/ID</TableHead>
                    <TableHead>Τύπος</TableHead>
                    <TableHead>Κατάσταση</TableHead>
                    <TableHead>Όροφοι</TableHead>
                    <TableHead>ID Κτιρίου</TableHead>
                    <TableHead>Ημ/νία Δημιουργίας</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUnits.map((unit) => (
                    <TableRow key={unit.id} onClick={() => handleRowClick(unit.id)} className="cursor-pointer">
                        <TableCell className="font-medium">{unit.identifier}</TableCell>
                        <TableCell className="font-medium">{unit.name}</TableCell>
                        <TableCell className="text-muted-foreground">{unit.type || 'N/A'}</TableCell>
                        <TableCell>
                            <Badge
                                variant="default" 
                                className={getStatusClass(unit.status)}>
                                {unit.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{unit.levelSpan || unit.floorIds?.join(', ')}</TableCell>
                        <TableCell className="text-muted-foreground">{unit.buildingId}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(unit.createdAt)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 && v.length < ALL_STATUSES.length : !!v) 
                    ? 'Δεν βρέθηκαν ακίνητα που να ταιριάζουν με τα φίλτρα.' 
                    : 'Δεν βρέθηκαν ακίνητα.'
                }
             </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

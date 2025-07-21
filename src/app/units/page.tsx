
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, Timestamp, getDocs } from 'firebase/firestore';
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
import { Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  floorId: string;
  buildingId: string;
  createdAt: any;
}

const fetchUnits = async (): Promise<Unit[]> => {
    const unitsCollection = collection(db, 'units');
    const snapshot = await getDocs(unitsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
}


export default function UnitsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { data: units = [], isLoading, isError } = useQuery<Unit[]>({
      queryKey: ['units'],
      queryFn: fetchUnits,
  });

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

  const getStatusClass = (status: Unit['status'] | undefined) => {
      switch(status) {
          case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600';
          case 'Κρατημένο': return 'bg-yellow-500 hover:bg-yellow-600';
          case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600';
          case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600';
          default: return 'bg-gray-500 hover:bg-gray-600';
      }
  }
  
  const filteredUnits = useMemo(() => {
    if (!units) return [];
    return units.filter((unit) => {
        const query = searchQuery.toLowerCase();
        return (
            unit.name.toLowerCase().includes(query) ||
            (unit.type && unit.type.toLowerCase().includes(query)) ||
            unit.status.toLowerCase().includes(query) ||
            unit.identifier.toLowerCase().includes(query)
        );
    });
  }, [units, searchQuery]);


  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ακίνητα (Units)
        </h1>
      </div>

       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Αναζήτηση βάση ονόματος, τύπου, κατάστασης..."
              className="pl-10 w-full md:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Όλων των Ακινήτων</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
             <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των δεδομένων.</p>
          ) : filteredUnits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Κωδικός</TableHead>
                  <TableHead>Όνομα/ID</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                  <TableHead>ID Ορόφου</TableHead>
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
                            className={`text-white ${getStatusClass(unit.status)}`}>
                            {unit.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{unit.floorId}</TableCell>
                    <TableCell className="text-muted-foreground">{unit.buildingId}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(unit.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Δεν βρέθηκαν ακίνητα που να ταιριάζουν με την αναζήτηση.' : 'Δεν βρέθηκαν ακίνητα.'}
             </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

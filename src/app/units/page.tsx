
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο';
  floorId: string;
  buildingId: string;
  createdAt: any;
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This will listen to the top-level 'units' collection
    const unsubscribe = onSnapshot(collection(db, 'units'), (snapshot) => {
      const unitsData: Unit[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Unit));
      setUnits(unitsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching units: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
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

  const getStatusVariant = (status: Unit['status'] | undefined): 'default' | 'secondary' | 'outline' => {
    switch(status) {
        case 'Πωλημένο': return 'destructive';
        case 'Κρατημένο': return 'secondary';
        case 'Διαθέσιμο': return 'default';
        default: return 'outline';
    }
  }


  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ακίνητα (Units)
        </h1>
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
          ) : units.length > 0 ? (
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
                {units.map((unit) => (
                  <TableRow key={unit.id} onClick={() => handleRowClick(unit.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{unit.identifier}</TableCell>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell className="text-muted-foreground">{unit.type || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(unit.status)} 
                                className={unit.status === 'Διαθέσιμο' ? 'bg-green-500 hover:bg-green-600' : 
                                           unit.status === 'Κρατημένο' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                           unit.status === 'Πωλημένο' ? 'bg-red-500 hover:bg-red-600' : ''}>
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
             <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν ακίνητα.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

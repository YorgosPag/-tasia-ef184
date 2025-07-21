
'use client';

import { useState, useEffect } from 'react';
import { collectionGroup, onSnapshot, Timestamp } from 'firebase/firestore';
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

interface Unit {
  id: string;
  name: string;
  type?: string;
  createdAt: any;
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This will listen to all 'units' subcollections across all documents
    const unitsQuery = collectionGroup(db, 'units');
    const unsubscribe = onSnapshot(unitsQuery, (snapshot) => {
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

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'dd/MM/yyyy');
    }
    return 'Άγνωστη ημερομηνία';
  };

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
                  <TableHead>Όνομα/ID</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell className="text-muted-foreground">{unit.type || 'N/A'}</TableCell>
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

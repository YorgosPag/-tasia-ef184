
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader2, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { exportToJson } from '@/lib/exporter';

interface Floor {
  id: string;
  level: string;
  description?: string;
  buildingId: string;
  createdAt: any;
}

export default function FloorsPage() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'floors'), (snapshot) => {
      const floorsData: Floor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Floor));
      setFloors(floorsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching floors: ", error);
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

  const handleRowClick = (floorId: string) => {
    router.push(`/floors/${floorId}`);
  };

  const filteredFloors = useMemo(() => {
    if (!floors) return [];
    return floors.filter(floor => {
      const query = searchQuery.toLowerCase();
      return (
        floor.level.toLowerCase().includes(query) ||
        (floor.description && floor.description.toLowerCase().includes(query)) ||
        floor.buildingId.toLowerCase().includes(query)
      );
    });
  }, [floors, searchQuery]);

  const handleExport = () => {
    const dataToExport = filteredFloors.map(f => ({
      ...f,
      createdAt: formatDate(f.createdAt),
    }));
    exportToJson(dataToExport, 'floors');
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Όροφοι
        </h1>
        <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredFloors.length === 0}>
            <Download className="mr-2"/>
            Εξαγωγή σε JSON
        </Button>
      </div>
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Αναζήτηση σε επίπεδο, περιγραφή, ID κτιρίου..."
              className="pl-10 w-full md:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Όλων των Ορόφων ({filteredFloors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFloors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Επίπεδο</TableHead>
                  <TableHead>Περιγραφή</TableHead>
                  <TableHead>Αναγνωριστικό Κτιρίου</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFloors.map((floor) => (
                  <TableRow key={floor.id} onClick={() => handleRowClick(floor.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{floor.level}</TableCell>
                    <TableCell className="text-muted-foreground">{floor.description || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{floor.buildingId}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(floor.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Δεν βρέθηκαν όροφοι που να ταιριάζουν με την αναζήτηση.' : 'Δεν βρέθηκαν όροφοι.'}
             </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
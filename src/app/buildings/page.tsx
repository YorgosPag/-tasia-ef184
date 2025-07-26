
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { format } from 'date-fns';
import { Input } from '@/shared/components/ui/input';

interface Building {
    id: string;
    address: string;
    type: string;
    projectId: string;
    createdAt: any;
}

export default function BuildingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'buildings'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setBuildings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Building)));
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching buildings:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load buildings." });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const filteredBuildings = buildings.filter(b => 
    b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Κτίρια</h1>
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Αναζήτηση σε διεύθυνση ή τύπο..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
       </div>
      <Card>
          <CardHeader>
              <CardTitle>Λίστα Κτιρίων ({filteredBuildings.length})</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
             ) : filteredBuildings.length > 0 ? (
                <Table>
                    <TableHeader><TableRow><TableHead>Διεύθυνση</TableHead><TableHead>Τύπος</TableHead><TableHead>Ημ/νία Δημιουργίας</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filteredBuildings.map((building) => (
                            <TableRow key={building.id} onClick={() => router.push(`/buildings/${building.id}`)} className="cursor-pointer">
                                <TableCell className="font-medium">{building.address}</TableCell>
                                <TableCell>{building.type}</TableCell>
                                <TableCell>{formatDate(building.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <p className="text-center py-8 text-muted-foreground">Δεν βρέθηκαν κτίρια.</p>
             )}
          </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
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

interface Floor {
    id: string;
    level: string;
    description?: string;
    buildingId: string;
    createdAt: any;
}
interface Building {
    id: string;
    address: string;
}

export default function FloorsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const buildingsMap = new Map(buildings.map(b => [b.id, b.address]));

  useEffect(() => {
    const qFloors = query(collection(db, 'floors'));
    const unsubscribeFloors = onSnapshot(qFloors, (snapshot) => {
        setFloors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor)));
        if(!isLoading) setIsLoading(false);
    }, (error) => {
        console.error("Error fetching floors:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load floors." });
        setIsLoading(false);
    });

    const qBuildings = query(collection(db, 'buildings'));
    const unsubscribeBuildings = onSnapshot(qBuildings, (snapshot) => {
        setBuildings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Building)));
        if(!isLoading) setIsLoading(false);
    }, (error) => {
        console.error("Error fetching buildings:", error);
    });
    
    setIsLoading(false);

    return () => {
      unsubscribeFloors();
      unsubscribeBuildings();
    };
  }, [toast, isLoading]);
  
  const filteredFloors = floors.filter(f => {
    const buildingAddress = buildingsMap.get(f.buildingId)?.toLowerCase() || '';
    return (
        f.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buildingAddress.includes(searchQuery.toLowerCase())
    )
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Όροφοι</h1>
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Αναζήτηση σε όροφο ή κτίριο..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
       </div>
      <Card>
          <CardHeader>
              <CardTitle>Λίστα Ορόφων ({filteredFloors.length})</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
             ) : filteredFloors.length > 0 ? (
                <Table>
                    <TableHeader><TableRow><TableHead>Επίπεδο</TableHead><TableHead>Κτίριο</TableHead><TableHead>Ημ/νία Δημιουργίας</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filteredFloors.map((floor) => (
                            <TableRow key={floor.id} onClick={() => router.push(`/floors/${floor.id}`)} className="cursor-pointer">
                                <TableCell className="font-medium">{floor.level}</TableCell>
                                <TableCell>{buildingsMap.get(floor.buildingId) || 'Άγνωστο Κτίριο'}</TableCell>
                                <TableCell>{formatDate(floor.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <p className="text-center py-8 text-muted-foreground">Δεν βρέθηκαν όροφοι.</p>
             )}
          </CardContent>
      </Card>
    </div>
  );
}

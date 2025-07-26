'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/shared/hooks/use-data-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { collection, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface Floor {
    id: string;
    level: string;
    buildingId: string;
    description?: string;
    createdAt: Timestamp;
}

async function fetchFloors(): Promise<Floor[]> {
    const floorsQuery = query(collection(db, 'floors'));
    return new Promise((resolve, reject) => {
        onSnapshot(floorsQuery, 
            (snapshot) => {
                const floors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor));
                resolve(floors);
            },
            (error) => {
                console.error("Error fetching floors:", error);
                reject(error);
            }
        );
    });
}

export default function FloorsPage() {
    const router = useRouter();
    const { buildings, projects, isLoading: isDataStoreLoading } = useDataStore();
    const [searchQuery, setSearchQuery] = useState('');
    
    const { data: floors = [], isLoading: isLoadingFloors } = useQuery({
        queryKey: ['allFloors'],
        queryFn: fetchFloors,
    });

    const getBuildingInfo = (buildingId: string) => {
        const building = buildings.find(b => b.id === buildingId);
        if (!building) return { address: 'N/A', projectTitle: 'N/A' };
        const project = projects.find(p => p.id === building.projectId);
        return {
            address: building.address,
            projectTitle: project?.title || 'N/A'
        };
    };

    const filteredFloors = useMemo(() => {
        if (!floors) return [];
        return floors.filter(floor => {
            const query = searchQuery.toLowerCase();
            const buildingInfo = getBuildingInfo(floor.buildingId);
            return (
                floor.level.toLowerCase().includes(query) ||
                (floor.description && floor.description.toLowerCase().includes(query)) ||
                buildingInfo.address.toLowerCase().includes(query) ||
                buildingInfo.projectTitle.toLowerCase().includes(query)
            );
        });
    }, [floors, searchQuery, buildings, projects]);

    const isLoading = isDataStoreLoading || isLoadingFloors;

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
    }

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        return format(timestamp.toDate(), 'dd/MM/yyyy');
    };

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Όροφοι</h1>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Αναζήτηση σε όροφο, κτίριο, έργο..."
                    className="pl-10 w-full md:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Λίστα Ορόφων ({filteredFloors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredFloors.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Επίπεδο</TableHead>
                                    <TableHead>Κτίριο</TableHead>
                                    <TableHead>Έργο</TableHead>
                                    <TableHead>Ημ/νία Δημιουργίας</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFloors.map((floor) => {
                                    const buildingInfo = getBuildingInfo(floor.buildingId);
                                    return (
                                        <TableRow key={floor.id} className="cursor-pointer group" onClick={() => router.push(`/floors/${floor.id}`)}>
                                            <TableCell className="font-medium">{floor.level}</TableCell>
                                            <TableCell className="text-muted-foreground">{buildingInfo.address}</TableCell>
                                            <TableCell className="text-muted-foreground">{buildingInfo.projectTitle}</TableCell>
                                            <TableCell className="text-muted-foreground">{formatDate(floor.createdAt)}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            {searchQuery ? 'Δεν βρέθηκαν όροφοι που να ταιριάζουν με την αναζήτηση.' : 'Δεν υπάρχουν καταχωρημένοι όροφοι.'}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/shared/hooks/use-data-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import Image from 'next/image';

export default function BuildingsPage() {
    const router = useRouter();
    const { buildings, projects, companies, isLoading } = useDataStore();
    const [searchQuery, setSearchQuery] = useState('');

    const getProjectTitle = (projectId: string) => projects.find(p => p.id === projectId)?.title || 'N/A';

    const filteredBuildings = useMemo(() => {
        if (!buildings) return [];
        return buildings.filter(building => {
            const query = searchQuery.toLowerCase();
            const projectTitle = getProjectTitle(building.projectId).toLowerCase();
            return (
                building.address.toLowerCase().includes(query) ||
                building.type.toLowerCase().includes(query) ||
                projectTitle.includes(query)
            );
        });
    }, [buildings, searchQuery, projects]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Κτίρια</h1>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Αναζήτηση σε διεύθυνση, τύπο, έργο..."
                    className="pl-10 w-full md:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Λίστα Κτιρίων ({filteredBuildings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredBuildings.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Φωτογραφία</TableHead>
                                    <TableHead>Διεύθυνση</TableHead>
                                    <TableHead>Τύπος</TableHead>
                                    <TableHead>Έργο</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBuildings.map((building) => (
                                    <TableRow key={building.id} className="cursor-pointer group" onClick={() => router.push(`/buildings/${building.id}`)}>
                                        <TableCell>
                                            <Image 
                                                src={(building as any).photoUrl || 'https://placehold.co/400x300.png'} 
                                                alt={building.address}
                                                width={64}
                                                height={48}
                                                className="rounded-md object-cover"
                                                data-ai-hint="building exterior"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{building.address}</TableCell>
                                        <TableCell className="text-muted-foreground">{building.type}</TableCell>
                                        <TableCell className="text-muted-foreground">{getProjectTitle(building.projectId)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            {searchQuery ? 'Δεν βρέθηκαν κτίρια που να ταιριάζουν με την αναζήτηση.' : 'Δεν υπάρχουν καταχωρημένα κτίρια.'}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

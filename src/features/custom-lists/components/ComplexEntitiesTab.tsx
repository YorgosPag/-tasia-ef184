'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Edit, Trash2 } from 'lucide-react';
import { useComplexEntities } from '../hooks/useComplexEntities';
import { exportToJson, exportToCsv } from '@/lib/exporter';
import { Loader2 } from 'lucide-react';

// For now, we hardcode the type. In a real app, this could be dynamic.
const ENTITY_TYPE = 'policeStation';

export function ComplexEntitiesTab() {
  const { entities, isLoading } = useComplexEntities(ENTITY_TYPE);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntities = useMemo(() => {
    if (!searchQuery) return entities;
    const lowercasedQuery = searchQuery.toLowerCase();
    return entities.filter(entity => 
        Object.values(entity).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery)
        )
    );
  }, [entities, searchQuery]);

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      exportToJson(filteredEntities, 'complex-entities-police-stations');
    } else {
      exportToCsv(filteredEntities, 'complex-entities-police-stations');
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Κατάλογος: Αστυνομικά Τμήματα</CardTitle>
          <CardDescription>Λίστα όλων των καταχωρημένων αστυνομικών τμημάτων.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Αναζήτηση σε τμήματα..." 
                        className="pl-10" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExport('csv')}><Download className="mr-2"/>Εξαγωγή σε Excel</Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport('json')}><Download className="mr-2"/>Εξαγωγή σε TXT</Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Όνομα</TableHead>
                            <TableHead>Διεύθυνση</TableHead>
                            <TableHead>Τηλέφωνο</TableHead>
                            <TableHead className="text-right">Ενέργειες</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEntities.map((entity) => (
                            <TableRow key={entity.id} className="group">
                                <TableCell className="font-medium">{entity.name}</TableCell>
                                <TableCell>{entity.address}</TableCell>
                                <TableCell>{entity.phone}</TableCell>
                                <TableCell className="text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
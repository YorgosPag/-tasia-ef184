
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';
import { useComplexEntities, type ComplexEntity, PAGE_SIZE } from '@/hooks/useComplexEntities';
import { processImportFile } from '@/lib/importer';
import { useToast } from '@/shared/hooks/use-toast';
import { exportToCsv } from '@/lib/exportUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';

// --- Column Definitions ---
const PREFERRED_COLUMN_ORDER = [
    'Οικισμοί',
    'Δημοτικές/Τοπικές Κοινότητες',
    'Δημοτικές Ενότητες',
    'Δήμοι',
    'Περιφερειακές ενότητες',
    'Περιφέρειες',
    'Αποκεντρωμένες Διοικήσεις',
    'Μεγάλες γεωγραφικές ενότητες'
];

const generateColumns = (
    data: ComplexEntity[], 
    filters: Record<string, string>, 
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>
): ColumnDef<ComplexEntity>[] => {
    if (!data || data.length === 0) {
       return PREFERRED_COLUMN_ORDER.map(key => ({
            accessorKey: key,
            header: () => (
              <div className="flex flex-col gap-1">
                <span>{key}</span>
                <Input
                    placeholder={`Φίλτρο...`}
                    value={filters[key] || ''}
                    onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-8"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
          ),
        }));
    }
    const firstItem = data[0];
    const keys = Object.keys(firstItem).filter(key => !['id', 'type', 'createdAt', 'uniqueKey'].includes(key));
    
    keys.sort((a, b) => {
        const indexA = PREFERRED_COLUMN_ORDER.indexOf(a);
        const indexB = PREFERRED_COLUMN_ORDER.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return keys.map(key => ({
        accessorKey: key,
        header: () => (
             <div className="flex flex-col gap-1">
                <span>{key}</span>
                <Input
                    placeholder={`Φίλτρο...`}
                    value={filters[key] || ''}
                    onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-8"
                    onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking input
                />
            </div>
        ),
        cell: info => info.getValue(),
    }));
};


export function ComplexEntitiesTab() {
  const { toast } = useToast();
  const [selectedListType, setSelectedListType] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const {
    entities,
    isLoading,
    listTypes,
    isLoadingListTypes,
    refetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    page,
    totalCount,
    initialDataLoaded
  } = useComplexEntities(selectedListType, columnFilters);

  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newListName, setNewListName] = useState('');
  
  const columns = useMemo(() => generateColumns(entities, columnFilters, setColumnFilters), [entities, columnFilters]);

  useEffect(() => {
    if (!isLoadingListTypes && listTypes.length > 0 && !selectedListType) {
      const preferredList = 'Διοικητική Διαίρεση Ελλάδας';
      if (listTypes.includes(preferredList)) {
        setSelectedListType(preferredList);
      } else if (listTypes[0]) {
        setSelectedListType(listTypes[0]);
      }
    }
  }, [isLoadingListTypes, listTypes, selectedListType]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !newListName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: 'Παρακαλώ δώστε όνομα λίστας και επιλέξτε ένα αρχείο.',
      });
      return;
    }

    setIsImporting(true);
    toast({
      title: 'Η εισαγωγή ξεκίνησε',
      description: 'Η λίστα σας επεξεργάζεται στο παρασκήνιο. Μπορείτε να συνεχίσετε την εργασία σας.',
    });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('listName', newListName);
      
      const result = await processImportFile(formData);

      if (result.errors.length > 0) {
        toast({
          variant: 'destructive',
          title: `Η εισαγωγή ολοκληρώθηκε με ${result.errors.length} σφάλματα`,
          description: `Το αρχείο καταγραφής είναι έτοιμο για λήψη.`,
          duration: 10000,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportToCsv(result.errors.map(e => ({ row: e.row, ...e.rowData, error: e.message })), `${newListName}-import-errors`);
              }}
            >
              Λήψη
            </Button>
          ),
        });
      } else {
        toast({
          title: 'Επιτυχής Εισαγωγή',
          description: `Η λίστα "${newListName}" δημιουργήθηκε με ${result.unitsCreated} εγγραφές.`,
        });
      }
      setNewListName('');
      setSelectedFile(null);
      const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      refetch();
    } catch (error: any) {
      console.error('Import failed:', error);
      toast({
        variant: 'destructive',
        title: 'Η εισαγωγή απέτυχε',
        description: error.message || 'Υπήρξε ένα απρόβλεπτο σφάλμα.',
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Εισαγωγή Σύνθετης Λίστας</CardTitle>
          <CardDescription>
            Ανεβάστε ένα αρχείο .xlsx ή .csv για μαζική εισαγωγή δεδομένων. Η πρώτη γραμμή πρέπει να περιέχει τις επικεφαλίδες.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Input
            placeholder="Όνομα Νέας Λίστας..."
            className="max-w-xs"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            disabled={isImporting}
          />
          <Input
            id="import-file-input"
            type="file"
            className="max-w-xs"
            onChange={handleFileChange}
            accept=".xlsx, .csv"
            disabled={!newListName.trim() || isImporting}
          />
          <Button onClick={handleImport} disabled={!selectedFile || !newListName.trim() || isImporting}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isImporting ? 'Γίνεται Εισαγωγή...' : 'Έναρξη Εισαγωγής'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                 <CardTitle>Κατάλογος Οντοτήτων</CardTitle>
                 {totalCount !== null && (
                    <p className="text-sm text-muted-foreground">Σύνολο Εγγραφών: {totalCount}</p>
                 )}
            </div>
            <div className="mt-4">
                 <Select onValueChange={setSelectedListType} value={selectedListType}>
                    <SelectTrigger className="w-full md:w-[350px]">
                         <SelectValue placeholder={isLoadingListTypes ? "Φόρτωση λιστών..." : "Επιλέξτε λίστα..."}>
                            {isLoadingListTypes ? <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> <span>Φόρτωση...</span></div> : selectedListType || "Επιλέξτε λίστα..."}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {isLoadingListTypes ? (
                            <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
                        ) : listTypes.length > 0 ? (
                            listTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)
                        ) : (
                            <p className="p-2 text-xs text-muted-foreground">Δεν βρέθηκαν λίστες.</p>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            {selectedListType ? (
                 <DataTable
                    columns={columns}
                    data={entities}
                    isLoading={isLoading}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    page={page}
                    canGoNext={canGoNext}
                    canGoPrev={canGoPrev}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    activeFilters={columnFilters}
                    initialDataLoaded={initialDataLoaded}
                 />
            ): (
                <div className="text-center py-10 text-muted-foreground">Παρακαλώ επιλέξτε μια λίστα για να δείτε τα δεδομένα.</div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

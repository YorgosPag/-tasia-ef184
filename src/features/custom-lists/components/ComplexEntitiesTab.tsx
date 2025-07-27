
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Search, UploadCloud } from 'lucide-react';
import { useComplexEntities } from '@/hooks/useComplexEntities';
import { DataTable } from './DataTable';
import { columns } from './columns';
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

export function ComplexEntitiesTab() {
  const { toast } = useToast();
  const [selectedListType, setSelectedListType] = useState<string>('');
  
  const {
    entities,
    isLoading: isLoadingEntities,
    error,
    searchQuery,
    setSearchQuery,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    listTypes,
    isLoadingListTypes,
    refetch,
  } = useComplexEntities(selectedListType || undefined);

  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newListName, setNewListName] = useState('');

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
      refetch(); // Refetch both list types and entities
      setSelectedListType(newListName); // Switch to the newly created list
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
  
  const currentEntities = useMemo(() => {
    if (!selectedListType) return [];
    return entities;
  }, [entities, selectedListType]);
  
  const isLoading = isLoadingEntities || isLoadingListTypes;

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
          <CardTitle>Κατάλογος Οντοτήτων</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Select onValueChange={setSelectedListType} value={selectedListType}>
                <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Επιλέξτε λίστα για προβολή..." />
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Αναζήτηση στην επιλεγμένη λίστα..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!selectedListType}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingEntities && selectedListType ? (
             <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : !selectedListType ? (
            <div className="text-center py-12 text-muted-foreground">
                <p>Παρακαλώ επιλέξτε μια λίστα από το παραπάνω μενού για να δείτε τα περιεχόμενά της.</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={currentEntities}
              onNextPage={nextPage}
              onPrevPage={prevPage}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';
import { useComplexEntities, type ComplexEntity } from '@/hooks/useComplexEntities';
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
import { AlgoliaSearchBox } from './AlgoliaSearchBox';

export function ComplexEntitiesTab() {
  const { toast } = useToast();
  const [selectedListType, setSelectedListType] = useState<string>('');
  const [algoliaHits, setAlgoliaHits] = useState<any[]>([]);

  const {
    listTypes,
    isLoadingListTypes,
    refetch,
  } = useComplexEntities();

  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newListName, setNewListName] = useState('');

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
          <CardTitle>Κατάλογος Οντοτήτων</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Select onValueChange={setSelectedListType} value={selectedListType}>
                    <SelectTrigger className="w-full md:w-[250px]">
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
                 {selectedListType && (
                    <AlgoliaSearchBox
                        key={selectedListType}
                        indexName={process***REMOVED***.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
                        listType={selectedListType}
                        onHitsChange={setAlgoliaHits}
                    />
                 )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

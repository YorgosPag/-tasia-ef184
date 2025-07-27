
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Label } from '@/shared/components/ui/label';

// We will create this server action later
// import { processImportFile } from '@/shared/lib/importer';

export function LargeListsTab() {
  const [listName, setListName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Λάθος τύπος αρχείου',
          description: 'Παρακαλώ επιλέξτε ένα αρχείο CSV ή Excel (.xlsx).',
        });
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !listName) return;
    setIsImporting(true);
    
    // This is a placeholder for the actual import logic
    // which will be a server action.
    toast({
      title: 'Η λειτουργία δεν είναι έτοιμη',
      description: 'Η εισαγωγή μεγάλων λιστών θα υλοποιηθεί σύντομα.',
    });

    console.log(`Simulating import for: ${selectedFile.name} into list: ${listName}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In the future, we will call the server action here:
    // const result = await processImportFile(listName, selectedFile);
    // if (result.success) {
    //   toast({ title: 'Επιτυχία', description: 'Η εισαγωγή ολοκληρώθηκε.'});
    // } else {
    //   toast({ variant: 'destructive', title: 'Σφάλμα', description: result.error });
    // }

    setIsImporting(false);
    setSelectedFile(null);
    setListName('');
    const input = document.getElementById('large-list-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Εισαγωγή Μεγάλης Λίστας</CardTitle>
        <CardDescription>
          Ορίστε ένα όνομα για τη νέα λίστα και ανεβάστε ένα αρχείο Excel (.xlsx) ή CSV για να εισάγετε μαζικά δεδομένα. 
          Η πρώτη γραμμή του αρχείου πρέπει να περιέχει τις επικεφαλίδες (headers).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="list-name">Όνομα Νέας Λίστας</Label>
            <Input 
                id="list-name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="π.χ. Κατάλογος Δ.Ο.Υ. Ελλάδος"
            />
        </div>

        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed" data-disabled={!listName}>
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            {selectedFile ? `Επιλεγμένο αρχείο: ${selectedFile.name}` : 'Σύρετε ένα αρχείο εδώ ή κάντε κλικ για επιλογή.'}
          </p>
          <Input 
            id="large-list-upload"
            type="file" 
            className="sr-only" 
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            disabled={!listName || isImporting}
          />
           <Button variant="link" asChild disabled={!listName || isImporting}>
             <label htmlFor="large-list-upload">Επιλογή αρχείου</label>
           </Button>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleImport} disabled={!selectedFile || !listName || isImporting}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isImporting ? 'Γίνεται εισαγωγή...' : 'Έναρξη Εισαγωγής'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

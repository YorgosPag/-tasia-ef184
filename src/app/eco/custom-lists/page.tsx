
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  PlusCircle,
  Download,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { customListsData } from '@/lib/eco-data';
import * as XLSX from 'xlsx';

interface ListItem {
  code: string | null;
  value: string;
}

interface CustomList {
  id: string;
  title: string;
  description: string;
  hasCode: boolean;
  items: ListItem[];
}

// Helper to export data to Excel
const exportToExcel = (list: CustomList) => {
    const dataToExport = list.items.map(item => ({
        'Τίτλος Λίστας': list.title,
        'Κωδικός Στοιχείου': item.code,
        'Τιμή Στοιχείου': item.value,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, list.title.slice(0, 31));
    XLSX.writeFile(workbook, `${list.title}.xlsx`);
};

// Helper to export data to TXT
const exportToTxt = (list: CustomList) => {
    const header = `Τίτλος Λίστας\tΚωδικός Στοιχείου\tΤιμή Στοιχείου\n`;
    const content = list.items.map(item => `${list.title}\t${item.code || ''}\t${item.value}`).join('\n');
    const blob = new Blob([header + content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${list.title}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
};


export default function CustomListsPage() {
  const [lists, setLists] = useState<CustomList[]>(customListsData);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newHasCode, setNewHasCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredLists = useMemo(() => {
    if (!searchQuery) return lists;
    return lists.filter(list =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lists, searchQuery]);
  
  const handleCreateList = () => {
      if(!newTitle) {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Ο τίτλος της λίστας είναι υποχρεωτικός.' });
          return;
      }
      const newList: CustomList = {
          id: `list_${Date.now()}`,
          title: newTitle,
          description: newDescription,
          hasCode: newHasCode,
          items: [],
      };
      setLists(prev => [newList, ...prev]);
      setNewTitle('');
      setNewDescription('');
      setNewHasCode(false);
      toast({ title: 'Επιτυχία', description: `Η λίστα "${newTitle}" δημιουργήθηκε.`});
  };

  const handleDeleteList = (listId: string) => {
      setLists(prev => prev.filter(list => list.id !== listId));
      toast({ title: 'Επιτυχία', description: 'Η λίστα διαγράφηκε.'});
  };

  const toggleAll = (state: 'open' | 'close') => {
      if (state === 'open') {
          setOpenAccordions(lists.map(l => l.id));
      } else {
          setOpenAccordions([]);
      }
  };


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Προσαρμοσμένες Λίστες & Κατάλογοι
        </h1>
        <p className="text-muted-foreground">
          Διαχειριστείτε τις λίστες επιλογών και τους καταλόγους σύνθετων
          οντοτήτων που χρησιμοποιούνται σε όλη την εφαρμογή.
        </p>
      </div>

      <Tabs defaultValue="simple-lists" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="simple-lists">Απλές Λίστες</TabsTrigger>
          <TabsTrigger value="complex-entities" disabled>
            Σύνθετες Οντότητες
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple-lists" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Δημιουργία Νέας Λίστας</CardTitle>
              <CardDescription>
                Δημιουργήστε μια νέα λίστα επιλογών για χρήση σε όλη την
                εφαρμογή.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="list-title">Τίτλος Λίστας</Label>
                <Input id="list-title" placeholder="π.χ. Κατηγορίες Παρεμβάσεων" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="list-description">Περιγραφή (Προαιρετικό)</Label>
                <Textarea id="list-description" placeholder="Μια σύντομη περιγραφή του σκοπού της λίστας." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="has-code" checked={newHasCode} onCheckedChange={setNewHasCode} />
                <Label htmlFor="has-code">Η λίστα περιέχει κωδικό;</Label>
              </div>
              <Button onClick={handleCreateList}><PlusCircle className="mr-2 h-4 w-4" />Δημιουργία Λίστας</Button>
            </CardContent>
          </Card>

          <div>
             <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                 <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Αναζήτηση σε απλές λίστες..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                 </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportToExcel(filteredLists[0])} disabled={filteredLists.length === 0}>
                        <Download className="mr-2 h-4 w-4" /> Εξαγωγή σε Excel
                    </Button>
                     <Button variant="outline" size="sm" onClick={() => exportToTxt(filteredLists[0])} disabled={filteredLists.length === 0}>
                        <Download className="mr-2 h-4 w-4" /> Εξαγωγή σε TXT
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleAll('open')}>
                        <ChevronDown className="mr-2 h-4 w-4"/> Ανάπτυξη Όλων
                    </Button>
                     <Button variant="ghost" size="sm" onClick={() => toggleAll('close')}>
                        <ChevronUp className="mr-2 h-4 w-4"/> Σύμπτυξη Όλων
                    </Button>
                 </div>
             </div>

            <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="w-full space-y-2">
              {filteredLists.map(list => (
                <AccordionItem key={list.id} value={list.id} className="border rounded-md px-4">
                  <div className="flex items-center justify-between">
                     <AccordionTrigger className="flex-1 py-4">
                        <div>
                            <h3 className="font-semibold">{list.title}</h3>
                            <p className="text-sm text-muted-foreground text-left">{list.description}</p>
                        </div>
                     </AccordionTrigger>
                     <div className="flex items-center gap-1 pl-4">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteList(list.id)}><Trash2 className="h-4 w-4"/></Button>
                     </div>
                  </div>
                  <AccordionContent>
                      <div className="max-h-60 overflow-y-auto pr-2">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left">
                                    {list.hasCode && <th className="p-2 font-medium text-muted-foreground">Κωδικός</th>}
                                    <th className="p-2 font-medium text-muted-foreground">Τιμή</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.items.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        {list.hasCode && <td className="p-2 font-mono">{item.code || '-'}</td>}
                                        <td className="p-2">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
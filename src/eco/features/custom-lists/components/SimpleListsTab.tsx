
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Search, PlusCircle, Loader2, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { useCustomLists } from '../hooks/useCustomLists';
import { EditableList } from './EditableList';
import { exportToJson, exportToCsv } from '@/lib/exporter';

export function SimpleListsTab() {
  const {
    lists,
    isLoading,
    addList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
  } = useCustomLists();

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newHasCode, setNewHasCode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  const filteredLists = useMemo(() => {
    if (!searchQuery) return lists;
    const lowercasedQuery = searchQuery.toLowerCase();
    return lists.filter(list => 
      list.title.toLowerCase().includes(lowercasedQuery) ||
      list.description.toLowerCase().includes(lowercasedQuery) ||
      list.items.some(item => item.value.toLowerCase().includes(lowercasedQuery) || item.code?.toLowerCase().includes(lowercasedQuery))
    );
  }, [lists, searchQuery]);

  const handleCreateList = async () => {
    if (!newTitle.trim()) return;
    setIsCreating(true);
    await addList({
      title: newTitle,
      description: newDescription,
      hasCode: newHasCode,
    });
    setNewTitle('');
    setNewDescription('');
    setNewHasCode(false);
    setIsCreating(false);
  };
  
  const handleExport = (format: 'json' | 'csv') => {
      const dataToExport = filteredLists.flatMap(list => 
        list.items.map(item => ({
            list_title: list.title,
            item_code: item.code || '',
            item_value: item.value,
        }))
      );
      if (format === 'json') {
          exportToJson(dataToExport, 'simple-lists');
      } else {
          exportToCsv(dataToExport, 'simple-lists');
      }
  }

  const expandAll = () => setOpenAccordionItems(filteredLists.map(l => l.id));
  const collapseAll = () => setOpenAccordionItems([]);
  
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
          <CardTitle>Δημιουργία Νέας Λίστας</CardTitle>
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
          <Button onClick={handleCreateList} disabled={isCreating}>
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />}
            Δημιουργία Λίστας
          </Button>
        </CardContent>
      </Card>
      
       <div className="space-y-4">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Αναζήτηση σε απλές λίστες..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
         </div>
         <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}><Download className="mr-2"/>Εξαγωγή σε Excel</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('json')}><Download className="mr-2"/>Εξαγωγή σε TXT</Button>
            <Button variant="ghost" size="sm" onClick={expandAll}><ChevronDown className="mr-2"/>Ανάπτυξη Όλων</Button>
            <Button variant="ghost" size="sm" onClick={collapseAll}><ChevronUp className="mr-2"/>Σύμπτυξη Όλων</Button>
         </div>
       </div>

      <div>
        <Accordion type="multiple" className="w-full space-y-2" value={openAccordionItems} onValueChange={setOpenAccordionItems}>
          {filteredLists.map(list => (
            <EditableList
              key={list.id}
              list={list}
              updateList={updateList}
              deleteList={deleteList}
              addItem={addItem}
              updateItem={updateItem}
              deleteItem={deleteItem}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );

}

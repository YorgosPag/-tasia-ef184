
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Search, PlusCircle, Loader2 } from 'lucide-react';
import { useCustomLists } from '../hooks/useCustomLists';
import { EditableList } from './EditableList';

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
          <CardDescription>Δημιουργήστε μια νέα λίστα επιλογών για χρήση σε όλη την εφαρμογή.</CardDescription>
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

      <div>
        <Accordion type="multiple" className="w-full space-y-2">
          {lists.map(list => (
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

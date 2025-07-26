
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  PlusCircle,
  Loader2,
  Trash2,
  FileDown,
  FileText,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCustomLists } from '@/nestor/features/custom-lists/hooks/useCustomLists';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { EditableList } from './EditableList';
import { exportToCsv, exportToTxt } from '@/nestor/lib/exportUtils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Separator } from '@/shared/components/ui/separator';

export function SimpleListsTab() {
  const {
    lists,
    isLoading,
    form,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    handleSaveList,
    handleDeleteList,
    addItem,
    updateItem,
    deleteItem,
  } = useCustomLists();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleExportCSV = () => {
    const dataToExport = filteredLists.flatMap(list => 
      list.items.map(item => ({
        list_title: list.title,
        item_code: item.code || '',
        item_value: item.value,
        list_description: list.description || '',
      }))
    );
    if (dataToExport.length > 0) {
      exportToCsv(dataToExport, 'simple-lists');
    }
  };

  const handleExportTXT = () => {
    const dataToExport = filteredLists;
    if (dataToExport.length > 0) {
      exportToTxt(dataToExport, 'simple-lists');
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Απλές Λίστες</CardTitle>
            <CardDescription>
              Λίστες που χρησιμοποιούνται για dropdowns, όπως Ρόλοι,
              Ειδικότητες κ.λπ.
            </CardDescription>
          </div>
           <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={isLoading || filteredLists.length === 0}>
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportTXT} disabled={isLoading || filteredLists.length === 0}>
                <FileText className="mr-2 h-4 w-4" />
                Export TXT
            </Button>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Νέα Λίστα
            </Button>
           </div>
        </div>
         <Input
            placeholder="Αναζήτηση λίστας..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 max-w-sm"
          />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <div className="space-y-4 pr-4">
              {filteredLists.length > 0 ? (
                filteredLists.map((list) => (
                  <EditableList
                    key={list.id}
                    list={list}
                    onAddItem={addItem}
                    onUpdateItem={updateItem}
                    onDeleteItem={deleteItem}
                    onDeleteList={handleDeleteList}
                  />
                ))
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed">
                  <p className="text-muted-foreground">Δεν βρέθηκαν λίστες.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Dialog for creating a new list */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Δημιουργία Νέας Λίστας</DialogTitle>
            <DialogDescription>
              Δώστε ένα όνομα και μια περιγραφή για τη νέα σας λίστα.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveList)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τίτλος</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="π.χ. Κατηγορίες Παρέμβασης"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Περιγραφή</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Μια σύντομη περιγραφή του σκοπού της λίστας."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasCode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                     <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Τα στοιχεία έχουν Κωδικό;
                        </FormLabel>
                        <FormDescription>
                          Επιλέξτε αν κάθε στοιχείο στη λίστα θα έχει έναν μοναδικό κωδικό εκτός από την τιμή του (π.χ. ΔΟΥ).
                        </FormDescription>
                      </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Ακύρωση
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Αποθήκευση
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

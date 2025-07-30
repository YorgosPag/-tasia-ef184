
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy, getDocs, writeBatch, doc, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CreateListForm } from './CreateListForm';
import { EditableList } from './EditableList';
import { Input } from '@/components/ui/input';
import { Search, Loader2, FileUp, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCsv, exportToTxt } from '@/lib/exporter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/logger';
import type { CustomList, ListItem } from '@/lib/types/definitions';

export function SimpleListsTab() {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchAllLists = useCallback(async () => {
    const listsQuery = query(collection(db, 'tsia-custom-lists'), orderBy('title', 'asc'));
    const unsubscribe = onSnapshot(listsQuery, async (listsSnapshot) => {
        const listsDataPromises = listsSnapshot.docs.map(async (listDoc) => {
            const listData = listDoc.data();
            const list: CustomList = { 
              id: listDoc.id, 
              title: listData.title,
              description: listData.description,
              hasCode: listData.hasCode,
              isProtected: listData.isProtected,
              items: [],
              createdAt: listData.createdAt,
            };
            const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('value', 'asc'));
            const itemsSnapshot = await getDocs(itemsQuery);
            list.items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
            return list;
        });
        const fetchedLists = await Promise.all(listsDataPromises);
        setLists(fetchedLists);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching custom lists:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η φόρτωση των λιστών απέτυχε.' });
        setIsLoading(false);
    });

    return unsubscribe;
  }, [toast]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const init = async () => {
        unsubscribe = await fetchAllLists();
    }
    init();
    return () => {
        if(unsubscribe) unsubscribe();
    };
  }, [fetchAllLists]);


  const filteredLists = lists.filter(
    (list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (list.description &&
        list.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleAccordionItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = (expand: boolean) => {
    if (expand) {
      setOpenItems(lists.map((l) => l.id));
    } else {
      setOpenItems([]);
    }
  };

  const handleExport = (format: 'csv' | 'txt') => {
    if (format === 'csv') {
      exportToCsv(
        lists.flatMap((l) =>
          l.items.map((i) => ({
            list_title: l.title,
            list_id: l.id,
            item_id: i.id,
            code: i.code,
            value: i.value,
          }))
        ),
        'custom-lists'
      );
    } else {
      exportToTxt(lists, 'custom-lists');
    }
  };

  return (
    <div className="space-y-8">
      <CreateListForm fetchAllLists={fetchAllLists} />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Υπάρχουσες Λίστες</h2>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Αναζήτηση σε απλές λίστες..."
              className="pl-10 w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Εξαγωγή</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Εξαγωγή σε Excel (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('txt')}>
                  Εξαγωγή σε TXT
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAll(true)}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Ανάπτυξη Όλων
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAll(false)}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Σύμπτυξη Όλων
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="w-full space-y-2">
            {filteredLists.length > 0 ? (
              filteredLists.map((list) => (
                <EditableList
                  key={`${list.id}-${list.items.length}`}
                  list={list}
                  isOpen={openItems.includes(list.id)}
                  onToggle={toggleAccordionItem}
                  fetchAllLists={fetchAllLists}
                />
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Δεν βρέθηκαν λίστες.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

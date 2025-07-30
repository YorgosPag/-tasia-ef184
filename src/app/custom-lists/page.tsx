
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleListsTab } from '@/components/custom-lists/SimpleListsTab';
import { ComplexEntitiesTab } from '@/components/custom-lists/ComplexEntitiesTab';

export default function CustomListsPage() {
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
          <TabsTrigger value="complex-entities">
            Σύνθετες Οντότητες
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple-lists" className="space-y-6 mt-4">
          <SimpleListsTab />
        </TabsContent>

        <TabsContent value="complex-entities" className="space-y-6 mt-4">
          <ComplexEntitiesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}


'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { SimpleListsTab } from '@/features/custom-lists/components/SimpleListsTab';
import { LargeListsTab } from '@/features/custom-lists/components/LargeListsTab';

export default function CustomListsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Προσαρμοσμένες Λίστες & Κατάλογοι</h1>
        <p className="text-muted-foreground">
          Διαχειριστείτε τις λίστες που χρησιμοποιούνται στα αναπτυσσόμενα μενού και τους καταλόγους της εφαρμογής.
        </p>
      </div>

      <Tabs defaultValue="simple-lists" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simple-lists">Απλές Λίστες</TabsTrigger>
          <TabsTrigger value="large-lists">Μεγάλες Λίστες</TabsTrigger>
          <TabsTrigger value="complex-entities">Σύνθετες Οντότητες</TabsTrigger>
        </TabsList>
        <TabsContent value="simple-lists" className="mt-4">
          <SimpleListsTab />
        </TabsContent>
        <TabsContent value="large-lists" className="mt-4">
          <LargeListsTab />
        </TabsContent>
        <TabsContent value="complex-entities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Σύνθετες Οντότητες</CardTitle>
               <CardDescription>
                Αυτοί οι κατάλογοι χρησιμοποιούνται για πιο δομημένες οντότητες, όπως Αστυνομικά Τμήματα, Δ.Ο.Υ., κ.λπ.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-muted-foreground">Η λειτουργικότητα για τις σύνθετες οντότητες θα υλοποιηθεί σύντομα.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

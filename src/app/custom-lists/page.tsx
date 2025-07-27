
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple-lists">Απλές Λίστες</TabsTrigger>
          <TabsTrigger value="complex-entities">Σύνθετες Οντότητες</TabsTrigger>
        </TabsList>
        <TabsContent value="simple-lists" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Απλές Λίστες</CardTitle>
              <CardDescription>
                Αυτές οι λίστες χρησιμοποιούνται για την τροφοδοσία των αναπτυσσόμενων μενού (dropdowns) σε όλη την εφαρμογή.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Η λειτουργικότητα για τις απλές λίστες θα υλοποιηθεί σύντομα.</p>
            </CardContent>
          </Card>
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

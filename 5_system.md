# CRM Tools Code Collection

Αυτό το αρχείο περιέχει τον κώδικα για τα βασικά εργαλεία CRM της εφαρμογής: Διαχείριση Επαφών, Διαχείριση Έργων, Διαχείριση Κτιρίων και Διαχείριση Ακινήτων.

---
## Περιεχόμενα Αρχεία & Συσχετίσεις

### 1. Διαχείριση Επαφών (Contacts)
- **`src/app/(main)/contacts/page.tsx`**: Κύρια σελίδα της ενότητας επαφών.
- **`src/app/(main)/contacts/new/page.tsx`**: Σελίδα δημιουργίας νέας επαφής.
- **`src/components/contacts/ContactList.tsx`**: Component για την εμφάνιση της λίστας επαφών.
- **`src/components/contacts/ContactForm.tsx`**: Κεντρικό form για δημιουργία/επεξεργασία επαφής.
- **`src/components/contacts/ContactEditViewWrapper.tsx`**: Wrapper για την προβολή και επεξεργασία μιας επαφής.
- **`src/hooks/use-contacts.ts`**: Hook για την ανάκτηση δεδομένων των επαφών.
- **`src/lib/validation/contactSchema.ts`**: Κεντρικό Zod schema για την επικύρωση των δεδομένων των επαφών.

### 2. Διαχείριση Έργων (Project Management)
- **`src/app/(main)/projects/page.tsx`**: Κύρια σελίδα της ενότητας έργων.
- **`src/components/projects/ProjectsPageView.tsx`**: Το view component της σελίδας έργων.
- **`src/components/projects/ProjectTable.tsx`**: Πίνακας εμφάνισης των έργων.
- **`src/components/projects/ProjectDetails.tsx`**: Αναλυτική προβολή ενός έργου (περιέχει τα tabs).
- **`src/hooks/use-projects-page.ts`**: Κεντρικό hook που διαχειρίζεται τη λογική της σελίδας.
- **`src/lib/types/project-types.ts`**: TypeScript definitions για τα projects.

### 3. Διαχείριση Κτιρίων (Building Management)
- **`src/app/(main)/building-management/page.tsx`**: Κύρια σελίδα της ενότητας διαχείρισης κτιρίων.
- **`src/components/building-management/BuildingsPageContent.tsx`**: Κεντρικό component περιεχομένου.
- **`src/components/building-management/BuildingsList.tsx`**: Λίστα κτιρίων.
- **`src/components/building-management/BuildingDetails.tsx`**: Αναλυτική προβολή κτιρίου.
- **`src/hooks/useBuildingFilters.ts`**: Hook για το φιλτράρισμα των κτιρίων.
- **`src/types/building.ts`**: TypeScript definitions για τα κτίρια.

### 4. Διαχείριση Ακινήτων (Property Management)
- **`src/app/(main)/property-management/page.tsx`**: Κύρια σελίδα της ενότητας διαχείρισης ακινήτων.
- **`src/components/property-management/PropertyManagementPageContent.tsx`**: Κεντρικό component περιεχομένου.
- **`src/components/projects/properties/PropertyList.tsx`**: Λίστα ακινήτων.
- **`src/components/projects/properties/PropertyDetails.tsx`**: Αναλυτική προβολή ακινήτου.
- **`src/hooks/usePropertyFilters.ts`**: Hook για το φιλτράρισμα των ακινήτων.
- **`src/types/property.ts`**: TypeScript definitions για τα ακίνητα.

---
# Πηγαίος Κώδικας

## src/app/(main)/contacts/page.tsx

```tsx
"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2, Download, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { exportToJson } from "@/lib/exporter";
import { useAuth } from "@/hooks/use-auth";
import { useContacts } from "@/hooks/use-contacts";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactEditViewWrapper } from "@/components/contacts/ContactEditViewWrapper";
import { ContactPlaceholder } from "@/components/contacts/detail-view/ContactPlaceholder";

export default function ContactsPage() {
  const { isEditor } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const { contacts, isLoading } = useContacts();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter((contact) => {
      const query = searchQuery.toLowerCase();
      return (
        (contact.name && contact.name.toLowerCase().includes(query)) ||
        (contact.entityType &&
          contact.entityType.toLowerCase().includes(query)) ||
        (contact.afm && contact.afm.toLowerCase().includes(query))
      );
    });
  }, [contacts, searchQuery]);

  useEffect(() => {
    if (filteredContacts.length > 0 && !selectedContactId) {
      setSelectedContactId(filteredContacts[0].id);
    } else if (
      selectedContactId &&
      !filteredContacts.find((c) => c.id === selectedContactId)
    ) {
      setSelectedContactId(filteredContacts.length > 0 ? filteredContacts[0].id : null);
    } else if (filteredContacts.length === 0) {
      setSelectedContactId(null);
    }
  }, [filteredContacts, selectedContactId]);

  const handleExport = () => {
    exportToJson(filteredContacts, "contacts");
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Επαφές
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={isLoading || filteredContacts.length === 0}
          >
            <Download className="mr-2" />
            Εξαγωγή σε JSON
          </Button>
          {isEditor && (
            <Button onClick={() => router.push("/contacts/new")}>
              <PlusCircle className="mr-2" />
              Νέα Επαφή
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
        <div className="md:col-span-1 lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Αναζήτηση επαφής..."
                  className="pl-10 w-full"
                  value={inputValue}
                  onChange={handleSearchChange}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading || isPending ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ContactList
                  contacts={filteredContacts}
                  onSelectContact={setSelectedContactId}
                  selectedContactId={selectedContactId}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          {selectedContactId ? (
            <ContactEditViewWrapper contactId={selectedContactId} />
          ) : (
            <ContactPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
}
```

## src/app/(main)/projects/page.tsx

```tsx
'use client';

import React from 'react';
import { ProjectsPageView } from '@/components/projects/ProjectsPageView';
import { useProjectsPage } from '@/hooks/use-projects-page';

export default function ProjectsPage() {
  const projectsPageProps = useProjectsPage();
  return <ProjectsPageView {...projectsPageProps} />;
}
```

## src/app/(main)/building-management/page.tsx

```tsx
'use client';

import React from 'react';
import { BuildingsPageContent } from '@/components/building-management/BuildingsPageContent';

export default function BuildingManagementPage() {
  return (
    <div className="h-full">
      <BuildingsPageContent />
    </div>
  );
}
```

## src/app/(main)/property-management/page.tsx

```tsx
'use client';

import React from 'react';
import { PropertyManagementPageContent } from '@/components/property-management/PropertyManagementPageContent';

export default function PropertyManagementPage() {
  return (
    <div className="h-full">
      <PropertyManagementPageContent />
    </div>
  );
}
```

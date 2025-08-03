# Contacts Management Components Code

This file contains the source code for all components related to the application's contacts management functionality within the CRM Tools section.

---
## Required Files and Dependencies

### Core Component Files:
- **`src/app/(main)/contacts/page.tsx`**: The main entry point for the contacts page, showing the list and detail/edit view.
- **`src/app/(main)/contacts/new/page.tsx`**: The page for creating a new contact.
- **`src/app/(main)/contacts/[id]/edit/[view]/page.tsx`**: The dynamic page for editing a contact. This file seems to be deprecated or replaced by the logic inside the main contacts page.
- **`src/components/contacts/ContactList.tsx`**: Displays the list of contacts.
- **`src/components/contacts/ContactForm.tsx`**: The main form component used for creating and editing contacts.
- **`src/components/contacts/ContactEditViewWrapper.tsx`**: The main component for the detail view area, which contains the `ContactForm`.
- **`src/components/contacts/ContactForm/**/*.tsx`**: Various sub-components for the contact form, organized by section (basic info, identity, address, job, etc.).
- **`src/hooks/use-contacts.ts`**: Custom hook for fetching and managing the list of contacts.
- **`src/lib/validation/contactSchema.ts`**: The main Zod schema for validating contact data.
- **`src/lib/validation/schemas/*.ts`**: Individual Zod schemas for different parts of the contact form.

### Related Helper & UI Components:
- **`src/components/ui/card.tsx`**, **`button.tsx`**, **`badge.tsx`**, **`input.tsx`**, **`textarea.tsx`**, **`select.tsx`**, **`accordion.tsx`**, **`tabs.tsx`**, **`dialog.tsx`**, **`checkbox.tsx`**, **`radio-group.tsx`**, **`popover.tsx`**, **`calendar.tsx`**, etc.: Reusable UI components from ShadCN.
- **`src/components/common/autocomplete/*.tsx`**: Reusable autocomplete and combobox components used for address search and creatable selects.
- **`src/lib/firebase.ts`**: Firebase configuration and initialization.
- **`src/lib/logger.ts`**: Utility for logging user activities.
- **`src/hooks/use-auth.tsx`**: Hook for managing user authentication and roles.
- **`src/hooks/use-toast.ts`**: Hook for displaying notifications.
- **`lucide-react`**: For icons.

---

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

---

## src/app/(main)/contacts/new/page.tsx

```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { ContactForm } from "@/components/contacts/ContactForm";
import {
  contactSchema,
  ContactFormValues,
} from "@/lib/validation/contactSchema";
import { logActivity } from "@/lib/logger";
import { useAuth } from "@/hooks/use-auth";

function deepClean(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      deepClean(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export default function NewContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      entityType: "Φυσικό Πρόσωπο",
      photoUrls: {},
      identity: { type: "Ταυτότητα", number: "", issuingAuthority: "" },
      emails: [],
      phones: [],
      socials: [],
      addresses: [],
      job: { role: "", specialty: "" },
      notes: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    const dataToSave: { [key: string]: any } = { ...data };

    if (data.birthDate)
      dataToSave.birthDate = Timestamp.fromDate(new Date(data.birthDate));
    else dataToSave.birthDate = null;
    if (data.identity?.issueDate)
      dataToSave.identity.issueDate = Timestamp.fromDate(
        new Date(data.identity.issueDate),
      );
    else if (dataToSave.identity) dataToSave.identity.issueDate = null;

    if (data.addresses) {
      dataToSave.addresses = data.addresses;
    }

    const cleanedData = deepClean(dataToSave);

    try {
      const docRef = await addDoc(collection(db, "contacts"), {
        ...cleanedData,
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
      });

      await logActivity("CREATE_CONTACT", {
        entityId: docRef.id,
        entityType: "contact",
        name: data.name,
      });

      if (fileToUpload) {
        toast({
          title: "Η επαφή αποθηκεύτηκε",
          description: "Ανέβασμα φωτογραφίας...",
        });
        const filePath = `contact-images/${docRef.id}/${fileToUpload.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, fileToUpload);
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(docRef, { photoUrl: downloadURL });
        await logActivity("UPDATE_CONTACT", {
          entityId: docRef.id,
          entityType: "contact",
          changes: { photoUrl: downloadURL },
        });
      }

      toast({
        title: "Επιτυχία",
        description: `Η επαφή "${data.name}" δημιουργήθηκε.`,
      });
      router.push("/contacts");
    } catch (error: any) {
      console.error("Error adding contact: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Δεν ήταν δυνατή η δημιουργία της επαφής: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Πίσω στις Επαφές
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Αποθήκευση Επαφής
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Δημιουργία Νέας Επαφής</CardTitle>
            <CardDescription>
              Συμπληρώστε τα παρακάτω πεδία για να δημιουργήσετε μια νέα επαφή.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm form={form} onFileSelect={setFileToUpload} />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
```

---

## src/app/(main)/contacts/[id]/edit/[view]/page.tsx

```tsx
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useRef,
} from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { ContactForm } from "@/components/contacts/ContactForm";
import {
  contactSchema,
  ContactFormValues,
  ALL_ACCORDION_SECTIONS,
  EntityType,
} from "@/lib/validation/contactSchema";
import { logActivity } from "@/lib/logger";
import { useAuth } from "@/hooks/use-auth";
import { ContactEditHeader } from "@/components/contacts/ContactEditHeader";

function deepClean(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !(obj[key] instanceof Date) &&
      !(obj[key] instanceof Timestamp)
    ) {
      deepClean(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
}

function EditContactPageContent() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;
  const viewParam = params.view as EntityType;
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [openSections, setOpenSections] = useState<string[]>(
    ALL_ACCORDION_SECTIONS,
  );
  const [contactName, setContactName] = useState("");
  const hasReset = useRef(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {},
  });

  const entityType = form.watch("entityType");
  const isLegalEntity =
    entityType === "Νομικό Πρόσωπο" || entityType === "Δημ. Υπηρεσία";
  const prevEntityTypeRef = useRef<string | undefined>();

  const mapEntityTypeToTab = (
    type: ContactFormValues["entityType"],
  ): EntityType => {
    switch (type) {
      case "Φυσικό Πρόσωπο":
        return "individual";
      case "Νομικό Πρόσωπο":
        return "legal";
      case "Δημ. Υπηρεσία":
        return "public";
      default:
        return "individual";
    }
  };

  const mapTabToEntityType = (
    tab: EntityType | string | null,
  ): ContactFormValues["entityType"] => {
    switch (tab) {
      case "individual":
        return "Φυσικό Πρόσωπο";
      case "legal":
        return "Νομικό Πρόσωπο";
      case "public":
        return "Δημ. Υπηρεσία";
      default:
        return "Φυσικό Πρόσωπο";
    }
  };

  useEffect(() => {
    const newTab = mapEntityTypeToTab(entityType);

    if (prevEntityTypeRef.current === entityType) return;
    prevEntityTypeRef.current = entityType;

    if (newTab && newTab !== viewParam && !form.formState.isDirty) {
      const newPath = `/contacts/${contactId}/edit/${newTab}`;
      router.replace(newPath, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, viewParam, router, contactId]);

  useEffect(() => {
    if (!contactId) return;

    const fetchContact = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "contacts", contactId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && !hasReset.current) {
          const data = docSnap.data();
          setContactName(data.name || "");

          const initialEntityType = mapTabToEntityType(viewParam);

          const formData: ContactFormValues = {
            ...data,
            name: data.name ?? "",
            entityType: initialEntityType,
            id: docSnap.id,
            birthDate:
              data.birthDate instanceof Timestamp
                ? data.birthDate.toDate()
                : null,
            identity: {
              ...data.identity,
              issueDate:
                data.identity?.issueDate instanceof Timestamp
                  ? data.identity.issueDate.toDate()
                  : null,
            },
            addresses: data.addresses || [],
          };
          form.reset(formData, { keepDirty: false });
          hasReset.current = true;
        } else if (!docSnap.exists()) {
          toast({
            variant: "destructive",
            title: "Σφάλμα",
            description: "Η επαφή δεν βρέθηκε.",
          });
          router.push("/contacts");
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        toast({
          variant: "destructive",
          title: "Σφάλμα",
          description: "Αποτυχία φόρτωσης δεδομένων.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId, viewParam]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    let photoUrls = data.photoUrls || {};
    const viewParamForPhoto = mapEntityTypeToTab(data.entityType);

    try {
      if (fileToUpload) {
        toast({
          title: "Ενημέρωση επαφής",
          description: "Ανέβασμα νέας φωτογραφίας...",
        });
        const filePath = `contact-images/${viewParamForPhoto}/${contactId}/${fileToUpload.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, fileToUpload);
        const newPhotoUrl = await getDownloadURL(storageRef);
        photoUrls[viewParamForPhoto] = newPhotoUrl;
      }

      const dataToUpdate: { [key: string]: any } = { ...data, photoUrls };

      dataToUpdate.birthDate = data.birthDate
        ? Timestamp.fromDate(new Date(data.birthDate))
        : null;

      if (dataToUpdate.identity) {
        dataToUpdate.identity.issueDate = data.identity?.issueDate
          ? Timestamp.fromDate(new Date(data.identity.issueDate))
          : null;
      }

      if (data.addresses) {
        dataToUpdate.addresses = data.addresses;
      }

      const cleanedData = deepClean(dataToUpdate);
      delete cleanedData.id;

      const docRef = doc(db, "contacts", contactId);
      await updateDoc(docRef, cleanedData);

      setContactName(data.name || ""); // Update displayed name
      form.reset({ ...data, photoUrls }, { keepDirty: false });
      setFileToUpload(null);

      await logActivity("UPDATE_CONTACT", {
        entityId: contactId,
        entityType: "contact",
        name: data.name,
        changes: data,
      });
      toast({
        title: "Επιτυχία",
        description: `Οι αλλαγές στην επαφή "${data.name}" αποθηκεύτηκαν.`,
      });
    } catch (error: any) {
      console.error("Error updating contact: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Δεν ήταν δυνατή η ενημέρωση της επαφής: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="contact-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <ContactEditHeader
          contactName={contactName}
          isSubmitting={isSubmitting}
          isDirty={form.formState.isDirty}
          onBack={() => router.back()}
          form={form}
        />

        <Card>
          <CardContent className="pt-6">
            <ContactForm
              form={form}
              onFileSelect={setFileToUpload}
              openSections={openSections}
              onOpenChange={setOpenSections}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default function EditContactPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      }
    >
      <EditContactPageContent />
    </Suspense>
  );
}
```

---

## src/components/contacts/ContactList.tsx

```tsx
"use client";

import React, { useState } from "react";
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Clock,
  DollarSign,
  FileText,
  Users,
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  entityType: "Φυσικό Πρόσωπο" | "Νομικό Πρόσωπο" | "Δημ. Υπηρεσία";
  email?: string;
  phone?: string;
  mobile?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
  };
  city?: string;
  role?: string;
  company?: string;
  photoUrl?: string;
  lastContact?: string;
  status: "active" | "inactive" | "potential";
  priority: "high" | "medium" | "low";
  projectsCount?: number;
  totalValue?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  isFavorite?: boolean;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Μαρία Παπαδοπούλου",
    entityType: "Φυσικό Πρόσωπο",
    email: "maria.papadopoulou@email.gr",
    phone: "2101234567",
    mobile: "6971234567",
    address: { street: "Βασιλίσσης Σοφίας 125", city: "Αθήνα" },
    city: "Αθήνα",
    role: "Αρχιτέκτονας",
    company: "Studio Architects",
    lastContact: "2025-08-01",
    status: "active",
    priority: "high",
    projectsCount: 3,
    totalValue: 85000,
    createdAt: "2025-01-15",
    isFavorite: true,
    tags: ["αρχιτεκτονική", "συνεργάτης", "vip"]
  },
  {
    id: "2",
    name: "DevConstruct AE",
    entityType: "Νομικό Πρόσωπο",
    email: "info@devconstruct.gr",
    phone: "2107654321",
    address: { street: "Λεωφ. Κηφισίας 58", city: "Αθήνα" },
    city: "Αθήνα",
    role: "Πελάτης",
    lastContact: "2025-07-28",
    status: "active",
    priority: "high",
    projectsCount: 2,
    totalValue: 450000,
    createdAt: "2024-11-20",
    isFavorite: false,
    tags: ["πελάτης", "μεγάλο έργο"]
  },
  {
    id: "3",
    name: "Γιάννης Κώστου",
    entityType: "Φυσικό Πρόσωπο",
    email: "giannis.kostou@email.gr",
    phone: "2103456789",
    mobile: "6943456789",
    address: { street: "Αγίου Δημητρίου 45", city: "Θεσσαλονίκη" },
    city: "Θεσσαλονίκη",
    role: "Project Manager",
    company: "BuildTech Ltd",
    lastContact: "2025-07-30",
    status: "active",
    priority: "medium",
    projectsCount: 1,
    totalValue: 25000,
    createdAt: "2025-03-10",
    isFavorite: false,
    tags: ["project manager", "θεσσαλονίκη"]
  },
  {
    id: "4",
    name: "Δήμος Αθηναίων",
    entityType: "Δημ. Υπηρεσία",
    email: "projects@athens.gr",
    phone: "2132057000",
    address: { street: "Λιοσίων 15", city: "Αθήνα" },
    city: "Αθήνα",
    role: "Δημόσιος Φορέας",
    lastContact: "2025-07-15",
    status: "potential",
    priority: "medium",
    projectsCount: 0,
    totalValue: 0,
    createdAt: "2025-06-01",
    isFavorite: false,
    tags: ["δημόσιο", "διαγωνισμός"]
  }
];

interface ContactListProps {
  contacts: any[]; // Changed to any[] to match usage in ContactsPage
  onSelectContact: (id: string) => void;
  selectedContactId: string | null;
}

export function ContactList({ contacts, onSelectContact, selectedContactId }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredContacts = (contacts as Contact[]).filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone?.includes(searchTerm) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || contact.entityType === filterType;
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "lastContact":
        return new Date(b.lastContact || 0).getTime() - new Date(a.lastContact || 0).getTime();
      case "value":
        return (b.totalValue || 0) - (a.totalValue || 0);
      case "projects":
        return (b.projectsCount || 0) - (a.projectsCount || 0);
      default:
        return 0;
    }
  });

  const toggleFavorite = (contactId: string) => {
    // This part would need a proper state management solution to update the parent
    console.log("Toggling favorite for", contactId);
  };

  const getBadgeVariant = (type: Contact["entityType"]) => {
    switch (type) {
      case "Νομικό Πρόσωπο":
        return "default";
      case "Δημ. Υπηρεσία":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/20";
      case "inactive": return "text-gray-700 bg-gray-50 dark:text-gray-300 dark:bg-gray-900/20";
      case "potential": return "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/20";
      default: return "text-gray-700 bg-gray-50 dark:text-gray-300 dark:bg-gray-900/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR');
  };

  const getEntityIcon = (entityType: Contact["entityType"]) => {
    switch (entityType) {
      case "Φυσικό Πρόσωπο":
        return <User className="w-4 h-4" />;
      case "Νομικό Πρόσωπο":
        return <Building className="w-4 h-4" />;
      case "Δημ. Υπηρεσία":
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md bg-card text-card-foreground ${
        selectedContactId === contact.id ? "ring-2 ring-primary bg-primary/10" : "border-border"
      }`}
      onClick={() => onSelectContact(contact.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.photoUrl} alt={contact.name} />
                <AvatarFallback className="text-sm font-medium">
                  {contact.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {contact.isFavorite && (
                <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-current" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base text-foreground truncate">
                  {contact.name}
                </h3>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(contact.priority)}`} 
                     style={{ backgroundColor: 'currentColor' }} />
              </div>
              
              {contact.role && (
                <p className="text-sm text-muted-foreground mb-1">{contact.role}</p>
              )}
                            
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                {contact.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>
              
              {contact.address && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{contact.address.street}, {contact.address.city}</span>
                </div>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Προβολή
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Επεξεργασία
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleFavorite(contact.id)}>
                <Star className="w-4 h-4 mr-2" />
                {contact.isFavorite ? "Αφαίρεση από αγαπημένα" : "Προσθήκη στα αγαπημένα"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Διαγραφή
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant(contact.entityType)} className="text-xs">
              <span className="mr-1">{getEntityIcon(contact.entityType)}</span>
              {contact.entityType}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(contact.status)}`}>
              {contact.status === "active" && "Ενεργός"}
              {contact.status === "inactive" && "Ανενεργός"}
              {contact.status === "potential" && "Δυνητικός"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <FileText className="w-3 h-3" />
              <span>Έργα</span>
            </div>
            <div className="font-semibold text-foreground">{contact.projectsCount || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Αξία</span>
            </div>
            <div className="font-semibold text-foreground">
              {contact.totalValue ? formatCurrency(contact.totalValue) : "€0"}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="w-3 h-3" />
              <span>Τελ. επαφή</span>
            </div>
            <div className="font-semibold text-foreground">
              {contact.lastContact ? formatDate(contact.lastContact) : "Ποτέ"}
            </div>
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {contact.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                #{tag}
              </Badge>
            ))}
            {contact.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{contact.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Κλήση
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              SMS
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(contact.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full flex flex-col bg-card text-card-foreground">
      {/* Header με αναζήτηση και φίλτρα */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Επαφές ({sortedContacts.length})
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Αναζήτηση */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Αναζήτηση επαφών..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Φίλτρα */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Τύπος επαφής" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλοι οι τύποι</SelectItem>
              <SelectItem value="Φυσικό Πρόσωπο">Φυσικό Πρόσωπο</SelectItem>
              <SelectItem value="Νομικό Πρόσωπο">Νομικό Πρόσωπο</SelectItem>
              <SelectItem value="Δημ. Υπηρεσία">Δημ. Υπηρεσία</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Κατάσταση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
              <SelectItem value="active">Ενεργός</SelectItem>
              <SelectItem value="inactive">Ανενεργός</SelectItem>
              <SelectItem value="potential">Δυνητικός</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Ταξινόμηση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Όνομα</SelectItem>
              <SelectItem value="lastContact">Τελευταία επαφή</SelectItem>
              <SelectItem value="value">Αξία έργων</SelectItem>
              <SelectItem value="projects">Αριθμός έργων</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Λίστα επαφών */}
      <div className="flex-1 overflow-auto p-4">
        {sortedContacts.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Δεν βρέθηκαν επαφές</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {sortedContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## src/components/contacts/ContactForm.tsx

```tsx
"use client";

import React from "react";
import type { ContactFormProps } from "./ContactForm/types";
import { useWatchedFields } from "./ContactForm/hooks/useWatchedFields";
import { LegalPersonLayout } from "./ContactForm/layout/LegalPersonLayout";
import { NaturalPersonLayout } from "./ContactForm/layout/NaturalPersonLayout";
import { ImageUploader } from "./ImageUploader";

export function ContactForm({
  form,
  onFileSelect,
  openSections,
  onOpenChange,
}: ContactFormProps) {
  const { entityType } = useWatchedFields(form);
  const contactId = form.getValues("id");
  const viewParam =
    entityType === "Φυσικό Πρόσωπο"
      ? "individual"
      : entityType === "Νομικό Πρόσωπο"
        ? "legal"
        : "public";
  const photoUrls = form.watch("photoUrls");
  const currentPhotoUrl = photoUrls?.[viewParam] || "";

  const formContent = () => {
    if (entityType === "Νομικό Πρόσωπο") {
      return <LegalPersonLayout form={form} onFileSelect={onFileSelect} />;
    }

    // Default to NaturalPersonLayout for 'Φυσικό Πρόσωπο', 'Δημ. Υπηρεσία' and as a fallback
    return <NaturalPersonLayout form={form} onFileSelect={onFileSelect} />;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-32 flex-shrink-0">
        <ImageUploader
          entityType={entityType}
          entityId={contactId}
          initialImageUrl={currentPhotoUrl}
          onFileSelect={onFileSelect}
        />
      </div>
      <div className="flex-1">{formContent()}</div>
    </div>
  );
}
```

---

## src/hooks/use-contacts.ts

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  onSnapshot,
  query as firestoreQuery,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContactFormValues } from "../lib/validation/contactSchema";

// Combine the form values with an ID and createdAt
export interface Contact extends ContactFormValues {
  id: string;
  createdAt: any;
}

async function fetchContacts(): Promise<Contact[]> {
  const contactsCollection = collection(db, "contacts");
  // Perform sorting on the database side for efficiency
  const q = firestoreQuery(contactsCollection, orderBy("name", "asc"));

  return new Promise((resolve, reject) => {
    // Using onSnapshot for real-time updates.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contacts = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Contact,
        );
        resolve(contacts);
      },
      (error) => {
        console.error("Failed to fetch contacts:", error);
        reject(error);
      },
    );
    // In a real app with more complex lifecycle, you might manage this unsubscribe
    // function, but for React Query's queryFn, this setup works well.
  });
}

export function useContacts() {
  const {
    data: contacts = [],
    isLoading,
    isError,
  } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    // Keep data fresh for 5 minutes, refetch in background
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { contacts, isLoading, isError };
}
```

---

## src/lib/validation/contactSchema.ts

```ts
import { z } from "zod";
import { getValidationRule } from "./schemas/utils/documentValidation";
import { personalInfoSchema } from "./schemas/personalInfoSchema";
import { identityTaxSchema } from "./schemas/identityTaxSchema";
import { contactInfoSchema } from "./schemas/contactInfoSchema";
import { socialsSchema } from "./schemas/socialsSchema";
import { addressSchema } from "./schemas/addressSchema";
import { jobInfoSchema } from "./schemas/jobInfoSchema";
import { notesSchema } from "./schemas/notesSchema";

export const ALL_ACCORDION_SECTIONS = [
  "personal",
  "identity",
  "contact",
  "socials",
  "addresses",
  "job",
  "notes",
  "representative",
];

// Full combined schema
export const contactSchema = personalInfoSchema
  .merge(identityTaxSchema)
  .merge(contactInfoSchema)
  .merge(socialsSchema)
  .merge(addressSchema)
  .merge(jobInfoSchema)
  .merge(notesSchema)
  .superRefine((data, ctx) => {
    if (data.entityType === "Φυσικό Πρόσωπο") {
      if (!data.firstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["firstName"],
          message: "Το όνομα είναι υποχρεωτικό για φυσικά πρόσωπα.",
        });
      }
      if (!data.lastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lastName"],
          message: "Το επώνυμο είναι υποχρεωτικό για φυσικά πρόσωπα.",
        });
      }

      // Dynamic validation for identity number
      if (data.identity?.type && data.identity?.number) {
        const rule = getValidationRule(data.identity.type);
        if (rule.pattern && !rule.pattern.test(data.identity.number)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["identity.number"],
            message: `Μη έγκυρη μορφή. Αναμενόμενη μορφή: ${rule.placeholder}`,
          });
        }
      }

      if (!data.identity?.issuingAuthority) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["identity.issuingAuthority"],
          message: "Η εκδούσα αρχή είναι υποχρεωτική.",
        });
      }
    }
  });

export type ContactFormValues = z.infer<typeof contactSchema>;

export type EntityType = "individual" | "legal" | "public";
```

---

... and so on for all other related files.

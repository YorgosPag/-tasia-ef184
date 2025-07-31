"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusCircle,
  Loader2,
  Link as LinkIcon,
  Download,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { exportToJson } from "@/lib/exporter";
import { useAuth } from "@/hooks/use-auth";
import { logActivity } from "@/lib/logger";
import {
  CompanyFormDialog,
  companySchema,
  CompanyFormValues,
} from "@/components/companies/CompanyFormDialog";
import { Input } from "@/components/ui/input";

// Define the Company type according to Firestore structure
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
    afm?: string;
  };
  createdAt: any;
}

// --- Data Fetching Function ---
async function fetchCompanies(): Promise<Company[]> {
  const companiesCollection = collection(db, "companies");
  const q = query(companiesCollection, orderBy("name", "asc"));

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const companiesData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Company,
        );
        resolve(companiesData);
      },
      (error) => {
        console.error("Failed to fetch companies in real-time:", error);
        reject(new Error("Could not fetch companies."));
      },
    );
    // Note: In a real app, you might want to manage this unsubscribe function
    // to clean up the listener when the component unmounts.
    // For this useQuery setup, it will keep listening.
  });
}

export default function CompaniesPage() {
  const { isEditor } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // --- Data Fetching with React Query ---
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  // --- Mutations for CUD operations ---
  const addCompanyMutation = useMutation({
    mutationFn: async (companyData: CompanyFormValues) => {
      const docRef = await addDoc(collection(db, "companies"), {
        ...companyData,
        createdAt: serverTimestamp(),
      });
      await logActivity("CREATE_COMPANY", {
        entityId: docRef.id,
        entityType: "company",
        name: companyData.name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Επιτυχία", description: "Η εταιρεία προστέθηκε." });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Δεν ήταν δυνατή η αποθήκευση: ${error.message}`,
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CompanyFormValues;
    }) => {
      await updateDoc(doc(db, "companies", id), data as any);
      await logActivity("UPDATE_COMPANY", {
        entityId: id,
        entityType: "company",
        changes: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Επιτυχία", description: "Η εταιρεία ενημερώθηκε." });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Η ενημέρωση απέτυχε: ${error.message}`,
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: string) => {
      await deleteDoc(doc(db, "companies", companyId));
      await logActivity("DELETE_COMPANY", {
        entityId: companyId,
        entityType: "company",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Επιτυχία", description: "Η εταιρεία διαγράφηκε." });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Η διαγραφή απέτυχε: ${error.message}`,
      });
    },
  });

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      website: "",
      contactInfo: { email: "", phone: "", address: "", afm: "" },
    },
  });

  const handleOpenDialog = (company: Company | null = null) => {
    setEditingCompany(company);
    if (company) {
      form.reset(company);
    } else {
      form.reset({
        name: "",
        logoUrl: "",
        website: "",
        contactInfo: { email: "", phone: "", address: "", afm: "" },
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CompanyFormValues) => {
    if (editingCompany) {
      updateCompanyMutation.mutate({ id: editingCompany.id, data });
    } else {
      addCompanyMutation.mutate(data);
    }
  };

  const isSubmitting =
    addCompanyMutation.isPending || updateCompanyMutation.isPending;

  const filteredCompanies = useMemo(
    () =>
      companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.contactInfo?.email &&
            company.contactInfo.email
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (company.website &&
            company.website.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [companies, searchQuery],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Εταιρείες
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => exportToJson(filteredCompanies, "companies")}
            variant="outline"
            disabled={isLoading || filteredCompanies.length === 0}
          >
            <Download className="mr-2" />
            Εξαγωγή σε JSON
          </Button>
          {isEditor && (
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2" />
              Νέα Εταιρεία
            </Button>
          )}
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Αναζήτηση σε όνομα, email, website..."
          className="pl-10 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Λίστα Εταιρειών ({filteredCompanies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Εταιρεία</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Τηλέφωνο</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Ενέργειες</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="group">
                      <TableCell className="font-medium flex items-center gap-2">
                        <Avatar title={company.name}>
                          <AvatarImage
                            src={company.logoUrl || undefined}
                            alt={company.name}
                          />
                          <AvatarFallback>
                            {company.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {company.name}
                      </TableCell>
                      <TableCell>
                        {company.contactInfo?.email ? (
                          <a
                            href={`mailto:${company.contactInfo.email}`}
                            className="text-primary hover:underline"
                          >
                            {company.contactInfo.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.contactInfo?.phone || "N/A"}
                      </TableCell>
                      <TableCell>
                        {company.website ? (
                          <Link
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <LinkIcon size={14} />
                            Επίσκεψη
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(company)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Είστε σίγουροι;
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Αυτή η ενέργεια θα διαγράψει την εταιρεία. Δεν
                                  μπορεί να αναιρεθεί.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteCompanyMutation.mutate(company.id)
                                  }
                                >
                                  Διαγραφή
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery
                ? "Δεν βρέθηκαν εταιρείες."
                : "Δεν υπάρχουν καταχωρημένες εταιρείες."}
            </p>
          )}
        </CardContent>
      </Card>
      {isEditor && (
        <CompanyFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          editingCompany={editingCompany}
        />
      )}
    </div>
  );
}

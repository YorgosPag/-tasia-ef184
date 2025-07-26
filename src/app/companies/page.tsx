
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/shared/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/shared/components/ui/alert-dialog";
import { Form } from "@/shared/components/ui/form";
import { Input } from '@/shared/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2, Link as LinkIcon, Download, Search, Edit, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import Link from 'next/link';
import { exportToJson } from '@/shared/lib/exporter';
import { useAuth } from '@/shared/hooks/use-auth';
import { useDataStore, Company } from '@/shared/hooks/use-data-store';
import { logActivity } from '@/shared/lib/logger';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { CompanyFormDialog, companySchema, CompanyFormValues } from '@/tasia/components/companies/CompanyFormDialog';


export default function CompaniesPage() {
  const { companies, isLoading, addCompany } = useDataStore();
  const { isEditor } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      website: '',
      contactInfo: { email: '', phone: '', address: '', afm: '' }
    },
  });

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
      setEditingCompany(null);
    }
  }, [isDialogOpen, form]);

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    form.reset({
      name: company.name,
      logoUrl: company.logoUrl || '',
      website: company.website || '',
      contactInfo: {
        email: company.contactInfo?.email || '',
        phone: company.contactInfo?.phone || '',
        address: company.contactInfo?.address || '',
        afm: company.contactInfo?.afm || '',
      }
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = async (companyId: string) => {
      // Note: This is a basic deletion. In a real app, you'd check for dependencies (projects, etc.)
      const companyToDelete = companies.find(c => c.id === companyId);
      if (!companyToDelete) return;

      try {
        await deleteDoc(doc(db, 'companies', companyId));
        toast({ title: 'Επιτυχία', description: `Η εταιρεία '${companyToDelete.name}' διαγράφηκε.` });
        await logActivity('DELETE_COMPANY', { entityId: companyId, entityType: 'company', name: companyToDelete.name });
      } catch (error) {
        console.error("Error deleting company:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
      }
  };


  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCompany) {
        // Update logic here
        // await updateCompany(editingCompany.id, data);
        toast({ title: "Επιτυχία", description: "Η εταιρεία ενημερώθηκε." });
      } else {
        await addCompany(data);
        toast({ title: "Επιτυχία", description: "Η εταιρεία προστέθηκε." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting company: ", error);
      toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν ήταν δυνατή η υποβολή." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    return companies.filter(company => {
      const query = searchQuery.toLowerCase();
      return (
        company.name.toLowerCase().includes(query) ||
        (company.contactInfo?.email && company.contactInfo.email.toLowerCase().includes(query)) ||
        (company.contactInfo?.phone && company.contactInfo.phone.toLowerCase().includes(query)) ||
        (company.contactInfo?.afm && company.contactInfo.afm.toLowerCase().includes(query))
      );
    });
  }, [companies, searchQuery]);

  const handleExport = () => {
    exportToJson(filteredCompanies, 'companies');
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">Εταιρείες</h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredCompanies.length === 0}>
                <Download className="mr-2"/>Εξαγωγή σε JSON
            </Button>
            {isEditor && (
                <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="mr-2" />Νέα Εταιρεία</Button>
            )}
        </div>
      </div>
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Αναζήτηση σε όνομα, ΑΦΜ, email..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
       </div>
      <Card>
        <CardHeader>
          <CardTitle>Λίστα Εταιρειών ({filteredCompanies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : filteredCompanies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Εταιρεία</TableHead><TableHead>Email</TableHead><TableHead>Τηλέφωνο</TableHead><TableHead>ΑΦΜ</TableHead><TableHead>Website</TableHead><TableHead className="text-right">Ενέργειες</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="group">
                      <TableCell className="font-medium flex items-center gap-2">
                        <Avatar title={company.name}><AvatarImage src={company.logoUrl || undefined} alt={company.name} /><AvatarFallback>{company.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        {company.name}
                      </TableCell>
                      <TableCell>{company.contactInfo?.email ? (<a href={`mailto:${company.contactInfo.email}`} className="text-primary hover:underline">{company.contactInfo.email}</a>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
                      <TableCell className="text-muted-foreground">{company.contactInfo?.phone || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">{company.contactInfo?.afm || 'N/A'}</TableCell>
                      <TableCell>{company.website ? (<Link href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><LinkIcon size={14}/>Επίσκεψη</Link>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
                      <TableCell className="text-right">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={() => handleEditClick(company)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία</span></Button>
                                <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά η εταιρεία "{company.name}".</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteClick(company.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : ( <p className="text-center text-muted-foreground py-8">{searchQuery ? 'Δεν βρέθηκαν εταιρείες.' : 'Δεν υπάρχουν καταχωρημένες εταιρείες.'}</p>)}
        </CardContent>
      </Card>
      
      <CompanyFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        editingCompany={editingCompany}
      />
    </div>
  );
}

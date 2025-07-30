
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Loader2, Link as LinkIcon, Download, Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { exportToJson } from '@/lib/exporter';
import { useAuth } from '@/hooks/use-auth';
import { useDataStore, Company } from '@/hooks/use-data-store';
import { logActivity } from '@/lib/logger';
import { CompanyFormDialog, companySchema, CompanyFormValues } from '@/components/companies/CompanyFormDialog';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';

export default function CompaniesPage() {
  const { companies, isLoading, addCompany } = useDataStore();
  const { isEditor } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { toast } = useToast();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      website: '',
      contactInfo: { email: '', phone: '', address: '', afm: '' }
    },
  });

  const handleOpenDialog = (company: Company | null = null) => {
    setEditingCompany(company);
    if(company) {
        form.reset(company);
    } else {
        form.reset({ name: '', logoUrl: '', website: '', contactInfo: { email: '', phone: '', address: '', afm: '' } });
    }
    setIsDialogOpen(true);
  }

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
        if(editingCompany) {
            await updateDoc(doc(db, 'companies', editingCompany.id), data);
            toast({ title: 'Επιτυχία', description: 'Η εταιρεία ενημερώθηκε.' });
            await logActivity('UPDATE_COMPANY', { entityId: editingCompany.id, entityType: 'company', changes: data });
        } else {
            const newId = await addCompany(data);
            if(newId) toast({ title: 'Επιτυχία', description: 'Η εταιρεία προστέθηκε.' });
        }
        setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting company: ", error);
      toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν ήταν δυνατή η αποθήκευση της εταιρείας." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (companyId: string) => {
      try {
          await deleteDoc(doc(db, 'companies', companyId));
          toast({title: 'Επιτυχία', description: 'Η εταιρεία διαγράφηκε.'});
          await logActivity('DELETE_COMPANY', { entityId: companyId, entityType: 'company' });
      } catch (error) {
          console.error('Error deleting company:', error);
          toast({variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.'});
      }
  }

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.contactInfo?.email && company.contactInfo.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (company.website && company.website.toLowerCase().includes(searchQuery.toLowerCase()))
    );
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
            {isEditor && (<Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2" />Νέα Εταιρεία</Button>)}
        </div>
      </div>
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Αναζήτηση σε όνομα, email, website..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
       </div>
      <Card>
        <CardHeader><CardTitle>Λίστα Εταιρειών ({filteredCompanies.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>)
          : filteredCompanies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Εταιρεία</TableHead><TableHead>Email</TableHead><TableHead>Τηλέφωνο</TableHead><TableHead>Website</TableHead><TableHead className="text-right">Ενέργειες</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="group">
                      <TableCell className="font-medium flex items-center gap-2">
                        <Avatar title={company.name}><AvatarImage src={company.logoUrl || undefined} alt={company.name} /><AvatarFallback>{company.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        {company.name}
                      </TableCell>
                      <TableCell>{company.contactInfo?.email ? (<a href={`mailto:${company.contactInfo.email}`} className="text-primary hover:underline">{company.contactInfo.email}</a>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
                      <TableCell className="text-muted-foreground">{company.contactInfo?.phone || 'N/A'}</TableCell>
                      <TableCell>{company.website ? (<Link href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><LinkIcon size={14}/>Επίσκεψη</Link>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
                      <TableCell className="text-right">
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-center">
                             <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(company)}><Edit className="h-4 w-4"/></Button>
                            <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει την εταιρεία. Δεν μπορεί να αναιρεθεί.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(company.id)}>Διαγραφή</AlertDialogAction></AlertDialogFooter>
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


'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2, Link as LinkIcon, Download, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataStore } from '@/hooks/use-data-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { exportToJson } from '@/lib/exporter';


const companySchema = z.object({
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  logoUrl: z.string().url({ message: "Το URL του λογότυπου δεν είναι έγκυρο." }).or(z.literal('')),
  website: z.string().url({ message: "Το URL του website δεν είναι έγκυρο." }).or(z.literal('')),
  contactInfo: z.object({
      email: z.string().email({ message: "Το email δεν είναι έγκυρο." }).or(z.literal('')),
      phone: z.string().optional(),
      address: z.string().optional(),
      afm: z.string().optional(),
  })
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompaniesPage() {
  const { companies, addCompany, isLoading } = useDataStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      website: '',
      contactInfo: {
          email: '',
          phone: '',
          address: '',
          afm: '',
      }
    },
  });
  
  // Effect to reset form when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      const companyData = {
        ...data,
        logoUrl: data.logoUrl?.trim() || undefined,
        website: data.website?.trim() || undefined,
      };
      await addCompany(companyData);
      toast({
        title: "Επιτυχία",
        description: "Η εταιρεία προστέθηκε με επιτυχία.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding company: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η προσθήκη της εταιρείας.",
      });
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
        (company.contactInfo?.afm && company.contactInfo.afm.toLowerCase().includes(query)) ||
        (company.contactInfo?.address && company.contactInfo.address.toLowerCase().includes(query))
      );
    });
  }, [companies, searchQuery]);

  const handleExport = () => {
    exportToJson(filteredCompanies, 'companies');
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Εταιρείες
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredCompanies.length === 0}>
                <Download className="mr-2"/>
                Εξαγωγή σε JSON
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2" />
                Νέα Εταιρεία
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Δημιουργία Νέας Εταιρείας</DialogTitle>
                <DialogDescription>
                    Συμπληρώστε τις παρακάτω πληροφορίες για να δημιουργήσετε μια νέα εταιρεία.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Όνομα Εταιρείας</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. Παπαδόπουλος Α.Ε." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL Λογοτύπου</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="contactInfo.address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Διεύθυνση</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. Αριστοτέλους 1, Αθήνα" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="contactInfo.afm"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ΑΦΜ</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. 123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="contactInfo.phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Τηλέφωνο</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. 2101234567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. contact@papadopoulos.gr" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isSubmitting}>
                        Ακύρωση
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting || isLoading}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Δημιουργία
                    </Button>
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
            </Dialog>
        </div>
      </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Αναζήτηση σε όνομα, ΑΦΜ, email..."
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
                    <TableHead>Λογότυπο</TableHead>
                    <TableHead>Όνομα</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Τηλέφωνο</TableHead>
                    <TableHead>ΑΦΜ</TableHead>
                    <TableHead>Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <Avatar title={company.name}>
                          <AvatarImage src={company.logoUrl || undefined} alt={company.name} />
                          <AvatarFallback>
                            {company.name
                              .split(' ')
                              .map(w => w[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()
                            }
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>
                        {company.contactInfo?.email ? (
                           <a href={`mailto:${company.contactInfo.email}`} className="text-primary hover:underline">
                            {company.contactInfo.email}
                           </a>
                        ) : (
                           <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{company.contactInfo?.phone || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">{company.contactInfo?.afm || 'N/A'}</TableCell>
                      <TableCell>
                        {company.website ? (
                          <Link href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            <LinkIcon size={14}/>
                            Επίσκεψη
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Δεν βρέθηκαν εταιρείες που να ταιριάζουν στην αναζήτηση.' : 'Δεν βρέθηκαν εταιρείες.'}
             </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

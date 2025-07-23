
'use client';

import { useState, useMemo } from 'react';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Mail, Inbox } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  email: string;
  message?: string;
  unitId: string;
  unitName: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: Timestamp;
}

async function fetchLeads(): Promise<Lead[]> {
    const leadsCollection = collection(db, 'leads');
    const q = query(leadsCollection, orderBy('createdAt', 'desc'));
    
    return new Promise((resolve, reject) => {
        onSnapshot(q, (snapshot) => {
        const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
        resolve(leads);
        }, (error) => {
        console.error("Failed to fetch leads:", error);
        reject(error);
        });
    });
}

async function updateLeadStatus(payload: { leadId: string, status: Lead['status'] }) {
    const { leadId, status } = payload;
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status });
}


export default function LeadsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  });

  const mutation = useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: 'Success', description: 'Lead status has been updated.' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update lead status.' });
    }
  })

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const query = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.unitName.toLowerCase().includes(query) ||
        lead.status.toLowerCase().includes(query) ||
        (lead.message && lead.message.toLowerCase().includes(query))
      );
    });
  }, [leads, searchQuery]);

  const handleStatusChange = (leadId: string, status: Lead['status']) => {
    mutation.mutate({ leadId, status });
  };
  
  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy, HH:mm');
  };
  
  const getStatusVariant = (status: Lead['status']) => {
    switch (status) {
      case 'New': return 'default';
      case 'Contacted': return 'secondary';
      case 'Closed': return 'outline';
      default: return 'secondary';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ενδιαφερόμενοι (Leads)
        </h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Αναζήτηση σε ονόματα, emails, ακίνητα..."
          className="pl-10 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Ενδιαφέροντος</CardTitle>
          <CardDescription>
            Όλες οι εκδηλώσεις ενδιαφέροντος που έχουν υποβληθεί από την ιστοσελίδα σας.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των δεδομένων.</p>
          ) : filteredLeads.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ημερομηνία</TableHead>
                        <TableHead>Όνομα</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ακίνητο</TableHead>
                        <TableHead>Μήνυμα</TableHead>
                        <TableHead className="text-right">Κατάσταση</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                            <TableCell className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>
                                <a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a>
                            </TableCell>
                             <TableCell>
                                <Link href={`/units/${lead.unitId}`} className="hover:underline">{lead.unitName}</Link>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={lead.message}>{lead.message || '-'}</TableCell>
                            <TableCell className="text-right">
                                <Select onValueChange={(value: Lead['status']) => handleStatusChange(lead.id, value)} defaultValue={lead.status}>
                                    <SelectTrigger className="w-[150px] h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Contacted">Contacted</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
                <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Δεν υπάρχουν εκδηλώσεις ενδιαφέροντος</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Όταν ένας πελάτης συμπληρώσει τη φόρμα, θα εμφανιστεί εδώ.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

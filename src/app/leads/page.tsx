
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import Link from 'next/link';
import { useToast } from '@/shared/hooks/use-toast';

// --- Types & Constants ---

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
const ALL_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];

interface Lead {
  id: string;
  name: string;
  email: string;
  message?: string;
  unitId: string;
  unitName: string;
  createdAt: Timestamp;
  status: LeadStatus;
}

const statusVariantMap: Record<LeadStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    'New': 'default',
    'Contacted': 'secondary',
    'Qualified': 'outline',
    'Lost': 'destructive'
};

// --- Data Fetching ---

async function fetchLeads(): Promise<Lead[]> {
    const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    return new Promise((resolve, reject) => {
        onSnapshot(leadsQuery, 
            (snapshot) => {
                const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
                resolve(leads);
            },
            (error) => {
                console.error("Error fetching leads:", error);
                reject(error);
            }
        );
    });
}

// --- Main Page Component ---

export default function LeadsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: leads = [], isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: fetchLeads,
        staleTime: 1000 * 60, // 1 minute
    });
    
    const updateStatusMutation = useMutation({
        mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) => {
            const leadRef = doc(db, 'leads', leadId);
            return updateDoc(leadRef, { status });
        },
        onSuccess: () => {
            toast({ title: 'Επιτυχία', description: 'Η κατάσταση του lead ενημερώθηκε.'});
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η ενημέρωση απέτυχε: ${error.message}`});
        }
    });

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = (
                lead.name.toLowerCase().includes(query) ||
                lead.email.toLowerCase().includes(query) ||
                lead.unitName.toLowerCase().includes(query)
            );
            const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [leads, searchQuery, statusFilter]);
    
    const formatDate = (timestamp?: Timestamp) => {
        if (!timestamp) return 'N/A';
        return format(timestamp.toDate(), 'dd/MM/yyyy HH:mm');
    };

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Leads</h1>
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Αναζήτηση σε όνομα, email, ακίνητο..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Φίλτρο κατάστασης" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                        {ALL_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Λίστα Leads ({filteredLeads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : filteredLeads.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ημερομηνία</TableHead>
                                <TableHead>Όνομα</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Ακίνητο</TableHead>
                                <TableHead>Μήνυμα</TableHead>
                                <TableHead>Κατάσταση</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="text-muted-foreground whitespace-nowrap">{formatDate(lead.createdAt)}</TableCell>
                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                    <TableCell><a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a></TableCell>
                                    <TableCell><Link href={`/units/${lead.unitId}`} className="text-primary hover:underline">{lead.unitName}</Link></TableCell>
                                    <TableCell className="text-muted-foreground max-w-xs truncate">{lead.message || '-'}</TableCell>
                                    <TableCell>
                                        <Select 
                                            defaultValue={lead.status} 
                                            onValueChange={(newStatus) => updateStatusMutation.mutate({ leadId: lead.id, status: newStatus as LeadStatus })}
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ALL_STATUSES.map(status => (
                                                    <SelectItem key={status} value={status}>
                                                        <Badge variant={statusVariantMap[status]} className="w-full justify-center">{status}</Badge>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν leads.</p>
                )}
                </CardContent>
            </Card>
        </div>
    );
}

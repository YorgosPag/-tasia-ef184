
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  unitId: string;
  unitName: string;
  createdAt: any;
  status: 'New' | 'Contacted' | 'Closed';
}

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching leads:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Failed to load leads.' });
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);
  
  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
      try {
          await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
          toast({title: 'Επιτυχία', description: 'Η κατάσταση του lead ενημερώθηκε.'});
      } catch (error) {
          toast({variant: 'destructive', title: 'Σφάλμα', description: 'Η αλλαγή κατάστασης απέτυχε.'});
      }
  }

  const filteredLeads = leads.filter(lead => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.unitName.toLowerCase().includes(query)
      );
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
  });
  
  const getStatusVariant = (status: Lead['status']) => {
    if(status === 'Contacted') return 'secondary';
    if(status === 'Closed') return 'outline';
    return 'default';
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Αναζήτηση σε όνομα, email, ακίνητο..." className="pl-10 w-full md:w-1/2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="All">Όλες οι Καταστάσεις</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader><CardTitle>Λίστα Leads ({filteredLeads.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : filteredLeads.length > 0 ? (
            <Table>
              <TableHeader><TableRow><TableHead>Ημ/νία</TableHead><TableHead>Όνομα</TableHead><TableHead>Email</TableHead><TableHead>Ακίνητο</TableHead><TableHead>Μήνυμα</TableHead><TableHead>Κατάσταση</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-xs text-muted-foreground">{format(lead.createdAt.toDate(), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell><a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a></TableCell>
                    <TableCell><Link href={`/units/${lead.unitId}`} className="text-primary hover:underline">{lead.unitName}</Link></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{lead.message}</TableCell>
                    <TableCell>
                        <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value as Lead['status'])}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue>
                                    <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
                                </SelectValue>
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
            <p className="text-center py-8 text-muted-foreground">{searchQuery || statusFilter !== 'All' ? 'Δεν βρέθηκαν leads.' : 'Δεν υπάρχουν leads.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

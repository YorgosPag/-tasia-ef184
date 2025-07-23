
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useState, useMemo } from 'react';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface LogEntry {
  id: string;
  action: string;
  entityId: string;
  entityType: string;
  userId: string;
  userEmail: string;
  timestamp: Timestamp;
  details?: Record<string, any>;
}

async function fetchAuditLogs(): Promise<LogEntry[]> {
  const logsCollection = collection(db, 'auditLogs');
  const q = query(logsCollection, orderBy('timestamp', 'desc'));
  
  return new Promise((resolve, reject) => {
    onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
      resolve(logs);
    }, (error) => {
      console.error("Failed to fetch audit logs:", error);
      reject(error);
    });
  });
}

function useAuditLogs() {
  return useQuery({
    queryKey: ['auditLogs'],
    queryFn: fetchAuditLogs,
    refetchOnWindowFocus: false, // Audit logs don't change that frequently for the same user
  });
}

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: logs = [], isLoading, isError } = useAuditLogs();
  const { isAdmin, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Access Denied' });
      router.push('/');
    }
  }, [isAdmin, isAuthLoading, router, toast]);

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'dd/MM/yyyy, HH:mm:ss', { locale: el });
    }
    return 'Άγνωστη ημερομηνία';
  };

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter((log) => {
        const query = searchQuery.toLowerCase();
        return (
            log.action.toLowerCase().includes(query) ||
            log.entityType.toLowerCase().includes(query) ||
            log.userEmail.toLowerCase().includes(query) ||
            log.entityId.toLowerCase().includes(query)
        );
    });
  }, [logs, searchQuery]);
  
  const getActionVariant = (action: string) => {
    if (action.startsWith('CREATE') || action.startsWith('DUPLICATE')) return 'default';
    if (action.startsWith('UPDATE') || action.startsWith('UPLOAD')) return 'secondary';
    if (action.startsWith('DELETE')) return 'destructive';
    return 'outline';
  }

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Fallback while redirecting
  }

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Audit Log
        </h1>
      </div>

       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Αναζήτηση σε ενέργειες, χρήστες, IDs..."
              className="pl-10 w-full md:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Ιστορικό Ενεργειών</CardTitle>
          <CardDescription>Καταγραφή όλων των αλλαγών που έχουν γίνει στην εφαρμογή.</CardDescription>
        </CardHeader>
        <CardContent>
          {isError ? (
             <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση του ιστορικού.</p>
          ) : filteredLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Χρονοσφραγίδα</TableHead>
                  <TableHead>Χρήστης</TableHead>
                  <TableHead>Ενέργεια</TableHead>
                  <TableHead>Τύπος Οντότητας</TableHead>
                  <TableHead>ID Οντότητας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{formatDate(log.timestamp)}</TableCell>
                    <TableCell className="font-medium">{log.userEmail}</TableCell>
                    <TableCell>
                      <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.entityType}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{log.entityId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Δεν βρέθηκαν εγγραφές που να ταιριάζουν με την αναζήτηση.' : 'Δεν υπάρχουν εγγραφές στο ιστορικό.'}
             </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

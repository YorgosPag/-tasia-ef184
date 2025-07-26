
'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
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
  projectId?: string;
}

async function fetchProjectAuditLogs(projectId: string): Promise<LogEntry[]> {
  if (!projectId) return [];
  
  const logsCollection = collection(db, 'auditLogs');
  const q = query(
    logsCollection, 
    where('projectId', '==', projectId), 
    orderBy('timestamp', 'desc')
  );
  
  return new Promise((resolve, reject) => {
    onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
      resolve(logs);
    }, (error) => {
      console.error("Failed to fetch project audit logs:", error);
      reject(error);
    });
  });
}


export function ProjectActivityTimeline({ projectId }: { projectId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const { data: logs = [], isLoading, isError } = useQuery({
      queryKey: ['projectAuditLogs', projectId],
      queryFn: () => fetchProjectAuditLogs(projectId),
      enabled: !!projectId,
  });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ιστορικό Ενεργειών Έργου</CardTitle>
        <CardDescription>
          Καταγραφή όλων των αλλαγών που έχουν γίνει σε αυτό το έργο.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Αναζήτηση στο ιστορικό του έργου..."
                className="pl-10 w-full md:w-1/3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : isError ? (
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
            {searchQuery ? 'Δεν βρέθηκαν εγγραφές που να ταιριάζουν με την αναζήτηση.' : 'Δεν υπάρχουν εγγραφές στο ιστορικό για αυτό το έργο.'}
            </p>
        )}
      </CardContent>
    </Card>
  );
}

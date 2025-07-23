
'use client';

import { useState, useMemo } from 'react';
import { collection, Timestamp, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { exportToJson } from '@/lib/exporter';
import { Input } from '@/components/ui/input';
import { AttachmentsListTable } from '@/components/attachments/AttachmentsListTable';

// --- Interfaces ---
export interface Attachment {
  id: string;
  type: 'parking' | 'storage';
  details?: string;
  area?: number;
  price?: number;
  photoUrl?: string;
  unitId?: string;
  sharePercentage?: number;
  isBundle?: boolean;
  isStandalone?: boolean;
  createdAt: any;
}

export interface Unit {
    id: string;
    identifier: string;
    name: string;
}

// --- Data Fetching Functions ---
async function fetchAttachments(): Promise<Attachment[]> {
  const snapshot = await getDocs(query(collection(db, 'attachments')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attachment));
}

async function fetchUnits(): Promise<Unit[]> {
    const snapshot = await getDocs(query(collection(db, 'units')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
}


export default function AttachmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { data: attachments = [], isLoading: isLoadingAttachments, isError: isErrorAttachments } = useQuery({
      queryKey: ['attachments'],
      queryFn: fetchAttachments
  });

  const { data: units = [], isLoading: isLoadingUnits, isError: isErrorUnits } = useQuery({
      queryKey: ['units'],
      queryFn: fetchUnits
  });

  const isLoading = isLoadingAttachments || isLoadingUnits;
  const isError = isErrorAttachments || isErrorUnits;

  // Create a quick lookup map for units
  const unitsMap = useMemo(() => {
    return new Map(units.map(u => [u.id, u]));
  }, [units]);


  const filteredAttachments = useMemo(() => {
    if (!attachments) return [];
    
    return attachments.filter((att) => {
        const query = searchQuery.toLowerCase();
        const parentUnit = att.unitId ? unitsMap.get(att.unitId) : null;
        
        return (
            (att.details && att.details.toLowerCase().includes(query)) ||
            (att.type.toLowerCase().includes(query)) ||
            (parentUnit && parentUnit.name.toLowerCase().includes(query)) ||
            (parentUnit && parentUnit.identifier.toLowerCase().includes(query))
        );
    });
  }, [attachments, searchQuery, unitsMap]);

  const handleExport = () => {
    const dataToExport = filteredAttachments.map(a => ({
      ...a,
      parentUnitName: a.unitId ? unitsMap.get(a.unitId)?.name : 'N/A',
      parentUnitIdentifier: a.unitId ? unitsMap.get(a.unitId)?.identifier : 'N/A',
      createdAt: a.createdAt ? format(a.createdAt.toDate(), 'dd/MM/yyyy') : 'N/A',
    }));
    exportToJson(dataToExport, 'attachments');
  };

  const handleEditAttachment = (attachment: Attachment) => {
      if (!attachment.unitId) {
          // This should ideally lead to a dedicated attachment edit page if they can be truly standalone
          // For now, we assume they must be edited in the context of a unit.
          alert("Standalone attachments cannot be edited from this view yet.");
          return;
      }
      router.push(`/units/${attachment.unitId}`);
  };


  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Παρακολουθήματα
        </h1>
        <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredAttachments.length === 0}>
            <Download className="mr-2"/>
            Εξαγωγή σε JSON
        </Button>
      </div>

       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Αναζήτηση σε τύπο, λεπτομέρειες, όνομα/κωδικό ακινήτου..."
              className="pl-10 w-full md:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Όλων των Παρακολουθημάτων ({filteredAttachments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
             <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των δεδομένων.</p>
          ) : filteredAttachments.length > 0 ? (
            <AttachmentsListTable
                attachments={filteredAttachments}
                unitsMap={unitsMap}
                onEdit={handleEditAttachment}
            />
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Δεν βρέθηκαν παρακολουθήματα που να ταιριάζουν στην αναζήτηση.' : 'Δεν βρέθηκαν παρακολουθήματα.'}
             </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useState, useMemo } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, FilePen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';

interface Inspection {
  id: string;
  text: string;
  photoUrl?: string;
  status: 'Pending' | 'Pass' | 'Fail';
  createdAt: any;
  stageId: string;
  substageId?: string;
  stageName: string;
  projectId: string;
  projectTitle: string;
}

async function fetchArchitectInspections(): Promise<Inspection[]> {
  const notes: Inspection[] = [];
  const projectsSnapshot = await getDocs(query(collection(db, 'projects')));
  const projectsMap = new Map(projectsSnapshot.docs.map(doc => [doc.id, { title: doc.data().title }]));

  // Query all top-level workStages and workSubstages
  const workStagesQuery = query(collection(db, 'workStages'));
  const workSubstagesQuery = query(collection(db, 'workSubstages'));

  const [stagesSnapshot, substagesSnapshot] = await Promise.all([
    getDocs(workStagesQuery),
    getDocs(workSubstagesQuery),
  ]);

  const stagesMap = new Map(stagesSnapshot.docs.map(doc => [doc.id, doc.data()]));

  // Process main stages
  for (const stageDoc of stagesSnapshot.docs) {
    const stageData = stageDoc.data();
    if (!stageData.projectId || !projectsMap.has(stageData.projectId)) continue;

    (stageData.inspections || []).forEach((note: any) => {
      notes.push({
        ...note,
        stageId: stageDoc.id,
        stageName: stageData.name,
        projectId: stageData.projectId,
        projectTitle: projectsMap.get(stageData.projectId)?.title || 'Unknown Project'
      });
    });
  }
  
  // Process substages
  for (const substageDoc of substagesSnapshot.docs) {
      const substageData = substageDoc.data();
      const parentStageData = substageData.parentStageId ? stagesMap.get(substageData.parentStageId) : null;
      if (!substageData.projectId || !projectsMap.has(substageData.projectId) || !parentStageData) continue;
      
      (substageData.inspections || []).forEach((note: any) => {
        notes.push({
          ...note,
          stageId: substageData.parentStageId,
          substageId: substageDoc.id,
          stageName: `${parentStageData.name} > ${substageData.name}`,
          projectId: substageData.projectId,
          projectTitle: projectsMap.get(substageData.projectId)?.title || 'Unknown Project'
        });
      });
  }


  return notes.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export default function ArchitectDashboardPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: inspections = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['architectInspections'],
    queryFn: fetchArchitectInspections,
  });

  const filteredInspections = useMemo(() => {
    return inspections.filter(note => {
      const query = searchQuery.toLowerCase();
      return (
        note.text.toLowerCase().includes(query) ||
        note.stageName.toLowerCase().includes(query) ||
        note.projectTitle.toLowerCase().includes(query) ||
        note.status.toLowerCase().includes(query)
      );
    });
  }, [inspections, searchQuery]);

  const handleStatusChange = async (inspection: Inspection, newStatus: Inspection['status']) => {
    try {
        const isSubstage = !!inspection.substageId;
        const collectionName = isSubstage ? 'workSubstages' : 'workStages';
        const docId = isSubstage ? inspection.substageId! : inspection.stageId;
      
        const stageDocRef = doc(db, collectionName, docId);
        const stageDoc = await getDoc(stageDocRef);

        if (!stageDoc.exists()) throw new Error("Stage or Substage document not found in top-level collection.");

        const currentStageData = stageDoc.data();
        const updatedInspections = currentStageData.inspections.map((n: any) => 
            n.id === inspection.id ? { ...n, status: newStatus } : n
        );
        
        // Update both the top-level and nested document in a batch
        const batch = db.batch();
        batch.update(stageDocRef, { inspections: updatedInspections });
        
        const nestedDocPath = isSubstage
            ? `projects/${inspection.projectId}/workStages/${inspection.stageId}/workSubstages/${inspection.substageId}`
            : `projects/${inspection.projectId}/workStages/${inspection.stageId}`;
        const nestedDocRef = doc(db, nestedDocPath);
        batch.update(nestedDocRef, { inspections: updatedInspections });

        await batch.commit();

        toast({ title: 'Success', description: `Inspection status updated to ${newStatus}.` });
        refetch(); // Refetch the data to update the UI
    } catch (error) {
        console.error("Error updating inspection status:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update inspection status.' });
    }
  };


  const getStatusVariant = (status: Inspection['status']) => {
    switch (status) {
      case 'Pass': return 'default';
      case 'Fail': return 'destructive';
      default: return 'secondary';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Architect's Dashboard
        </h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Αναζήτηση σε επιθεωρήσεις, έργα, στάδια..."
          className="pl-10 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Επισκόπηση Επιθεωρήσεων Εργοταξίου</CardTitle>
          <CardDescription>
            Όλες οι επιθεωρήσεις που απαιτούν αρχιτεκτονική επίβλεψη, συγκεντρωμένες σε ένα μέρος.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των επιθεωρήσεων.</p>
          ) : filteredInspections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInspections.map((inspection) => (
                <Card key={inspection.id} className="flex flex-col">
                  {inspection.photoUrl && (
                    <Image
                      src={inspection.photoUrl}
                      alt={`Inspection for ${inspection.stageName}`}
                      width={400}
                      height={300}
                      className="object-cover w-full rounded-t-lg aspect-video"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-base">
                        <Link href={`/projects/${inspection.projectId}?view=construction`} className="hover:underline">
                            {inspection.projectTitle}
                        </Link>
                    </CardTitle>
                    <CardDescription>{inspection.stageName}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm">{inspection.text}</p>
                  </CardContent>
                  <CardContent className="flex items-center justify-between gap-2 mt-auto pt-4">
                    <Badge variant={getStatusVariant(inspection.status)}>{inspection.status}</Badge>
                    <Select onValueChange={(value: Inspection['status']) => handleStatusChange(inspection, value)} defaultValue={inspection.status}>
                      <SelectTrigger className="w-[150px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
                <FilePen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Όλα υπό έλεγχο!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Δεν υπάρχουν εκκρεμείς επιθεωρήσεις που να απαιτούν την προσοχή σας.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    

    
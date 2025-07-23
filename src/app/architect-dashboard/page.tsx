
'use client';

import { useState, useMemo } from 'react';
import { collectionGroup, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, FilePen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface FieldNote {
  id: string;
  text: string;
  photoUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: any;
  stageId: string;
  substageId?: string;
  stageName: string;
  projectId: string;
  projectTitle: string;
}

async function fetchArchitectNotes(): Promise<FieldNote[]> {
  const notes: FieldNote[] = [];
  const projectsSnapshot = await getDocs(query(collection(db, 'projects')));
  const projectsMap = new Map(projectsSnapshot.docs.map(doc => [doc.id, doc.data().title]));

  // Query all workStages collections
  const stagesQuery = collectionGroup(db, 'workStages');
  const stagesSnapshot = await getDocs(stagesQuery);

  for (const stageDoc of stagesSnapshot.docs) {
    const stageData = stageDoc.data();
    const projectId = stageDoc.ref.parent.parent?.id;
    if (!projectId) continue;

    (stageData.fieldNotes || []).forEach((note: any) => {
      notes.push({
        ...note,
        stageId: stageDoc.id,
        stageName: stageData.name,
        projectId: projectId,
        projectTitle: projectsMap.get(projectId) || 'Unknown Project'
      });
    });

    // Query substages
    const substagesSnapshot = await getDocs(collection(stageDoc.ref, 'workSubstages'));
    for (const substageDoc of substagesSnapshot.docs) {
      const substageData = substageDoc.data();
      (substageData.fieldNotes || []).forEach((note: any) => {
        notes.push({
          ...note,
          stageId: stageDoc.id,
          substageId: substageDoc.id,
          stageName: `${stageData.name} > ${substageData.name}`,
          projectId: projectId,
          projectTitle: projectsMap.get(projectId) || 'Unknown Project'
        });
      });
    }
  }

  return notes.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export default function ArchitectDashboardPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: notes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['architectNotes'],
    queryFn: fetchArchitectNotes,
  });

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const query = searchQuery.toLowerCase();
      return (
        note.text.toLowerCase().includes(query) ||
        note.stageName.toLowerCase().includes(query) ||
        note.projectTitle.toLowerCase().includes(query) ||
        note.status.toLowerCase().includes(query)
      );
    });
  }, [notes, searchQuery]);

  const handleStatusChange = async (note: FieldNote, newStatus: FieldNote['status']) => {
    try {
      const path = note.substageId
        ? `projects/${note.projectId}/workStages/${note.stageId}/workSubstages/${note.substageId}`
        : `projects/${note.projectId}/workStages/${note.stageId}`;
      const stageDocRef = doc(db, path);
      
      // We need to read the document to update the array
      const stageDoc = await getDocs(query(collectionGroup(db, note.substageId ? 'workSubstages' : 'workStages'), where('__name__', '==', stageDocRef.path)));
      if (stageDoc.empty) throw new Error("Stage document not found");

      const currentStageData = stageDoc.docs[0].data();
      const updatedFieldNotes = currentStageData.fieldNotes.map((n: any) => 
        n.id === note.id ? { ...n, status: newStatus } : n
      );
      
      await updateDoc(stageDoc.docs[0].ref, { fieldNotes: updatedFieldNotes });

      toast({ title: 'Success', description: `Note status updated to ${newStatus}.` });
      refetch(); // Refetch the data to update the UI
    } catch (error) {
      console.error("Error updating note status:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update note status.' });
    }
  };


  const getStatusVariant = (status: FieldNote['status']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Rejected': return 'destructive';
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
          placeholder="Αναζήτηση σε παρατηρήσεις, έργα, στάδια..."
          className="pl-10 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Επισκόπηση Παρατηρήσεων Εργοταξίου</CardTitle>
          <CardDescription>
            Όλες οι παρατηρήσεις που απαιτούν αρχιτεκτονική επίβλεψη, συγκεντρωμένες σε ένα μέρος.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των παρατηρήσεων.</p>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="flex flex-col">
                  {note.photoUrl && (
                    <Image
                      src={note.photoUrl}
                      alt={`Note for ${note.stageName}`}
                      width={400}
                      height={300}
                      className="object-cover w-full rounded-t-lg aspect-video"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-base">
                        <Link href={`/projects/${note.projectId}?view=construction`} className="hover:underline">
                            {note.projectTitle}
                        </Link>
                    </CardTitle>
                    <CardDescription>{note.stageName}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm">{note.text}</p>
                  </CardContent>
                  <CardContent className="flex items-center justify-between gap-2 mt-auto pt-4">
                    <Badge variant={getStatusVariant(note.status)}>{note.status}</Badge>
                    <Select onValueChange={(value: FieldNote['status']) => handleStatusChange(note, value)} defaultValue={note.status}>
                      <SelectTrigger className="w-[150px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
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
                    Δεν υπάρχουν εκκρεμείς παρατηρήσεις που να απαιτούν την προσοχή σας.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

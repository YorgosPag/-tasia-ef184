
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDocs, collection, query, where, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Upload, Eye, Trash2 } from 'lucide-react';
import { Unit } from '@/tasia/hooks/use-unit-details';
import { Input } from '@/components/ui/input';

interface FloorInfo {
  id: string;
  level: string;
}

interface UnitFloorPlansTabProps {
  unit: Unit;
}

const PLAN_TYPES = [
  { id: 'applicationUrl', label: 'Κάτοψη Εφαρμογής' },
  { id: 'urbanPlanningUrl', label: 'Κάτοψη Πολεοδομίας' },
] as const;

type PlanType = typeof PLAN_TYPES[number]['id'];

export function UnitFloorPlansTab({ unit }: UnitFloorPlansTabProps) {
  const { toast } = useToast();
  const [floors, setFloors] = useState<FloorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ file: File; floorId: string; planType: PlanType } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const getFloorsData = useCallback(async () => {
    if (!unit.floorIds || unit.floorIds.length === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const floorsQuery = query(collection(db, 'floors'), where('__name__', 'in', unit.floorIds));
    const snapshot = await getDocs(floorsQuery);
    const floorsData = snapshot.docs.map(doc => ({ id: doc.id, level: doc.data().level }));
    floorsData.sort((a,b) => a.level.localeCompare(b.level, undefined, { numeric: true }));
    setFloors(floorsData);
    setIsLoading(false);
  }, [unit.floorIds]);
  
  useEffect(() => {
    getFloorsData();
  }, [getFloorsData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, floorId: string, planType: PlanType) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile({ file, floorId, planType });
    } else {
      setSelectedFile(null);
      if (file) toast({ variant: 'destructive', title: 'Λάθος τύπος αρχείου', description: 'Επιλέξτε αρχείο PDF.' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    const { file, floorId, planType } = selectedFile;
    const storageRef = ref(storage, `unit_floor_plans/${unit.id}/${floorId}/${planType}/${file.name}`);
    
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const unitRef = doc(db, 'units', unit.id);
      await updateDoc(unitRef, {
        [`floorPlans.${floorId}.${planType}`]: downloadURL
      });
      
      toast({ title: 'Επιτυχία', description: 'Η κάτοψη ανέβηκε.' });
      setSelectedFile(null);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η μεταφόρτωση απέτυχε: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (floorId: string, planType: PlanType) => {
    try {
      const unitRef = doc(db, 'units', unit.id);
      await updateDoc(unitRef, {
        [`floorPlans.${floorId}.${planType}`]: null
      });
      toast({ title: 'Επιτυχία', description: 'Η κάτοψη διαγράφηκε.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η διαγραφή απέτυχε: ${error.message}` });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }
  
  return (
    <div className="space-y-6">
      {PLAN_TYPES.map(({ id, label }) => (
        <Card key={id}>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Επίπεδο</TableHead>
                  <TableHead>Κάτοψη</TableHead>
                  <TableHead className="w-[350px]">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {floors.map(floor => {
                  const currentPlanUrl = unit.floorPlans?.[floor.id]?.[id];
                  const isUploadingThisFile = isUploading && selectedFile?.floorId === floor.id && selectedFile?.planType === id;

                  return (
                    <TableRow key={floor.id}>
                      <TableCell className="font-semibold">{floor.level}</TableCell>
                      <TableCell>
                        {currentPlanUrl ? (
                          <div className="flex items-center gap-2">
                            <a href={currentPlanUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-xs">{currentPlanUrl.split('%2F').pop()?.split('?')[0]}</a>
                            <Button variant="ghost" size="icon" onClick={() => window.open(currentPlanUrl, '_blank')}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(floor.id, id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Δεν έχει οριστεί</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input type="file" accept=".pdf" className="text-xs h-9" onChange={(e) => handleFileChange(e, floor.id, id)} />
                           <Button size="sm" onClick={handleUpload} disabled={isUploading || selectedFile?.floorId !== floor.id || selectedFile?.planType !== id}>
                            {isUploadingThisFile ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                            Ανέβασμα
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

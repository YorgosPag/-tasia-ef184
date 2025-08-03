'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { Building, Milestone } from '@/types/building';

export function TimelineTab({ building }: { building: Building }) {
  const [milestones] = useState<Milestone[]>([
    { id: 1, title: "Έναρξη Έργου", description: "Υπογραφή συμβολαίου και έναρξη εργασιών", date: "2006-05-02", status: "completed", progress: 100, type: "start" },
    { id: 2, title: "Θεμέλια & Υπόγειο", description: "Ολοκλήρωση εκσκαφών και κατασκευή θεμελίων", date: "2006-08-15", status: "completed", progress: 100, type: "construction" },
    { id: 3, title: "Κατασκευή Φέροντα Οργανισμού", description: "Σκελετός κτιρίου - όροφοι 1-7", date: "2007-12-20", status: "completed", progress: 100, type: "construction" },
    { id: 4, title: "Τοιχοποιίες & Στεγανοποίηση", description: "Κλείσιμο κτιρίου και στεγανότητα", date: "2008-06-30", status: "completed", progress: 100, type: "construction" },
    { id: 5, title: "Ηλ/Μηχ Εγκαταστάσεις", description: "Ηλεκτρολογικές και μηχανολογικές εγκαταστάσεις", date: "2008-11-15", status: "in-progress", progress: 85, type: "systems" },
    { id: 6, title: "Τελικές Εργασίες", description: "Χρωματισμοί, δάπεδα, διακοσμητικά στοιχεία", date: "2009-01-30", status: "pending", progress: 45, type: "finishing" },
    { id: 7, title: "Παράδοση Έργου", description: "Τελικός έλεγχος και παράδοση στον πελάτη", date: "2009-02-28", status: "pending", progress: 0, type: "delivery" }
  ]);

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-500';
      case 'in-progress': return 'bg-blue-500 border-blue-500';
      case 'pending': return 'bg-gray-300 border-gray-300';
      case 'delayed': return 'bg-red-500 border-red-500';
      default: return 'bg-gray-300 border-gray-300';
    }
  };

  const getStatusText = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'Ολοκληρώθηκε';
      case 'in-progress': return 'Σε εξέλιξη';
      case 'pending': return 'Εκκρεμεί';
      case 'delayed': return 'Καθυστέρηση';
      default: return 'Άγνωστο';
    }
  };

  const getTypeIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'start': return '🚀';
      case 'construction': return '🏗️';
      case 'systems': return '⚡';
      case 'finishing': return '🎨';
      case 'delivery': return '🎯';
      default: return '📋';
    }
  };

  const daysUntilCompletion = building.completionDate ? Math.ceil((new Date(building.completionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Χρονοδιάγραμμα Έργου</h3>
          <p className="text-sm text-muted-foreground">Παρακολούθηση προόδου και milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">{milestones.filter(m => m.status === 'completed').length} / {milestones.length} ολοκληρώθηκαν</Badge>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Συνολική Πρόοδος</span>
            <span className="text-2xl font-bold text-blue-600">{building.progress}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={building.progress} className="h-4 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center"><div className="text-2xl font-bold text-green-600">{milestones.filter(m => m.status === 'completed').length}</div><div className="text-muted-foreground">Ολοκληρωμένα</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-blue-600">{milestones.filter(m => m.status === 'in-progress').length}</div><div className="text-muted-foreground">Σε εξέλιξη</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-gray-600">{milestones.filter(m => m.status === 'pending').length}</div><div className="text-muted-foreground">Εκκρεμεί</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-purple-600">{daysUntilCompletion ?? '-'}</div><div className="text-muted-foreground">Ημέρες απομένουν</div></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Λεπτομερή Milestones</CardTitle></CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  <div className={cn("relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 shadow-sm", getStatusColor(milestone.status), milestone.status === 'completed' ? 'text-white' : 'text-gray-600')}>
                    <span className="text-lg">{getTypeIcon(milestone.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{milestone.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs", milestone.status === 'completed' ? 'bg-green-50 text-green-700 border-green-300' : milestone.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-gray-50 text-gray-700 border-gray-300')}>{getStatusText(milestone.status)}</Badge>
                        <span className="text-sm text-muted-foreground">{new Date(milestone.date).toLocaleDateString('el-GR')}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{milestone.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm"><span>Πρόοδος milestone</span><span className="font-medium">{milestone.progress}%</span></div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                    {milestone.status === 'in-progress' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"><div className="flex items-center gap-2 text-sm text-blue-800"><Clock className="w-4 h-4" /><span className="font-medium">Επόμενα βήματα:</span></div><ul className="mt-2 text-sm text-blue-700 space-y-1"><li>• Ολοκλήρωση κεντρικού θερμικού συστήματος</li><li>• Εγκατάσταση ανελκυστήρων</li><li>• Τελικός έλεγχος ηλεκτρολογικών</li></ul></div>
                    )}
                    {milestone.status === 'completed' && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /><span>Ολοκληρώθηκε στις {new Date(milestone.date).toLocaleDateString('el-GR')}</span></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500" />Κρίσιμα Σημεία</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"><div><p className="font-medium text-orange-900">Ηλ/Μηχ Εγκαταστάσεις</p><p className="text-sm text-orange-700">Επηρεάζει την παράδοση</p></div><Badge variant="outline" className="bg-orange-100 text-orange-700">5 ημέρες καθυστέρηση</Badge></div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"><div><p className="font-medium text-yellow-900">Τελικές Εργασίες</p><p className="text-sm text-yellow-700">Εξαρτάται από προηγούμενο</p></div><Badge variant="outline" className="bg-yellow-100 text-yellow-700">Αναμονή</Badge></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" />Πρόβλεψη Ολοκλήρωσης</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Αρχικό χρονοδιάγραμμα</span><span className="font-medium">28/02/2009</span></div>
                <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Τρέχουσα πρόβλεψη</span><span className="font-medium text-orange-600">05/03/2009</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Καθυστέρηση</span><Badge variant="outline" className="bg-orange-100 text-orange-700">+5 ημέρες</Badge></div>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground"><p className="mb-2">💡 <strong>Συμβουλή:</strong></p><p>Επιτάχυνση ηλ/μηχ εργασιών μπορεί να μειώσει την καθυστέρηση στις 2-3 ημέρες.</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

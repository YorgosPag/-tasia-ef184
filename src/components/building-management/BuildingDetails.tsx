'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Folder } from 'lucide-react';

type Building = {
    id: number;
    name: string;
};

interface BuildingDetailsProps {
    building: Building;
}

const GeneralTabContent = () => (
    <div className="space-y-4">
        <div className="space-y-1">
            <Label>Τίτλος Κτιρίου</Label>
            <Input defaultValue="ΚΤΙΡΙΟ Α (Μανδηλαρά - Πεζόδρομος & Πεζόδρομος)" />
        </div>
        <div className="space-y-1">
            <Label>Περιγραφή Κτιρίου</Label>
            <Textarea 
                defaultValue="Το κτίριο αποτελείται από πέντε ορόφους εκ των οποίων το ισόγειο και ο πρώτος ανήκουν στο Δήμο και πρόκειται να στεγάσουν ένα βρεφονηπιακό σταθμό και ένα κέντρο νεότητας. Οι υπόλοιποι τέσσερεις όροφοι οργανώνονται σε πέντε γκαρσονιέρες και δύο διαμερίσματα των δύο δωματίων."
                rows={5}
            />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1"><Label>Σύνολο Δόμησης Κτιρίου</Label><Input defaultValue="2.109,24" /></div>
            <div className="space-y-1"><Label>Κόστος Ανά Μέτρο Δόμησης Κτιρίου</Label><Input defaultValue="700.00" /></div>
            <div className="space-y-1"><Label>Σύνολο Καθαρών Μέτρων Κτιρίου</Label><Input defaultValue="0.00" /></div>
            <div className="space-y-1"></div>
            <div className="space-y-1"><Label>Σύνολο Μικτών Μέτρων Κτιρίου</Label><Input defaultValue="0.00" /></div>
            <div className="space-y-1"><Label>Τιμή πώλησης Ανά Μικτού τ.μ.</Label><Input defaultValue="1.600,00" /></div>
            <div className="space-y-1"><Label>Σύνολο Ημιυπαιθρίων Κτιρίου</Label><Input defaultValue="400,43" /></div>
             <div className="space-y-1"></div>
            <div className="space-y-1"><Label>Σύνολο Κοινοχρήστων Κτιρίου</Label><Input defaultValue="0.00" /></div>
             <div className="space-y-1"></div>
            <div className="space-y-1"><Label>Σύνολο Μπαλκονιών</Label><Input defaultValue="308,28" /></div>
            <div className="space-y-1"><Label>Επίπεδα Κτιρίου</Label><Input defaultValue="7" /></div>
        </div>

        <div className="space-y-1">
            <Label>Συγγραφή Υποχρεώσεων</Label>
            <div className="flex gap-2">
                <Input defaultValue="\Server\shared\6. erga\Paleologou\Paleol_Gen\Paleol_Gen_Pinak Syggr\pal syggrafi.doc" />
                <Button variant="outline" size="icon"><Folder className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon"><Eye className="w-4 h-4" /></Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-1"><Label>Ημερομηνία Έναρξης Κατασκευής Κτιρίου</Label><Input defaultValue="2/5/2006" /></div>
             <div className="space-y-1"><Label>Ημερομηνία Παράδοσης Βάσει Εργολαβικού</Label><Input defaultValue="2/2/2009" /></div>
             <div className="space-y-1"><Label>Ημερομηνία Παράδοσης Βάσει Πρόβλεψης</Label><Input defaultValue="28/2/2009" /></div>
        </div>

        <div className="border rounded-md p-4 space-y-2">
            <h4 className="font-medium text-sm">Κανονισμός Κτιρίου</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="space-y-1"><Label>Αριθμός Συμβολαίου</Label><Input /></div>
                 <div className="space-y-1"><Label>Ημερ. Συμβολαίου</Label><Input /></div>
                 <div className="space-y-1"><Label>Αρχείο Συμβολαίου</Label><Input /></div>
                 <div className="space-y-1"><Label>Συμβολαιογράφος</Label><Input /></div>
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <Checkbox id="show-on-web" />
            <Label htmlFor="show-on-web">Προβολή στο διαδίκτυο</Label>
        </div>
    </div>
);


const PlaceholderTab = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center h-full p-8 border rounded-md bg-background">
        <h2 className="text-xl font-semibold text-muted-foreground">{title}</h2>
    </div>
);


export function BuildingDetails({ building }: BuildingDetailsProps) {
    return (
        <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0">
            <div className="p-2 border-b bg-background flex items-center justify-between rounded-t-lg">
                <h3 className="text-sm font-semibold">{building.name}</h3>
                <Button size="sm">Επίδειξη Κτιρίου</Button>
            </div>
            <main className="flex-1 overflow-auto p-4">
                <div className="flex flex-col h-full">
                    <Tabs defaultValue="general" className="flex flex-col h-full">
                        <TabsList className="shrink-0 flex-wrap h-auto justify-start">
                            <TabsTrigger value="general">Γενικά</TabsTrigger>
                            <TabsTrigger value="storage">Αποθήκες</TabsTrigger>
                            <TabsTrigger value="contracts">Συμβόλαια Πελατών</TabsTrigger>
                            <TabsTrigger value="protocols">Υ.Δ.Τοιχοποιίας & Πρωτόκολλα</TabsTrigger>
                            <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
                            <TabsTrigger value="videos">Videos</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="flex-grow overflow-auto mt-4">
                            <GeneralTabContent />
                        </TabsContent>
                        <TabsContent value="storage" className="flex-grow overflow-auto mt-4">
                            <PlaceholderTab title="Αποθήκες" />
                        </TabsContent>
                        <TabsContent value="contracts" className="flex-grow overflow-auto mt-4">
                             <PlaceholderTab title="Συμβόλαια Πελατών" />
                        </TabsContent>
                         <TabsContent value="protocols" className="flex-grow overflow-auto mt-4">
                             <PlaceholderTab title="Υ.Δ.Τοιχοποιίας & Πρωτόκολλα" />
                        </TabsContent>
                        <TabsContent value="photos" className="flex-grow overflow-auto mt-4">
                            <PlaceholderTab title="Φωτογραφίες" />
                        </TabsContent>
                        <TabsContent value="videos" className="flex-grow overflow-auto mt-4">
                            <PlaceholderTab title="Videos" />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

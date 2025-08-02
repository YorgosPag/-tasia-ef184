'use client';

import React from 'react';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Folder, Eye, MapPin, Building, FileText, Settings } from "lucide-react"
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function GeneralProjectTab() {
  return (
    <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic-info">Βασικές Πληροφορίες</TabsTrigger>
            <TabsTrigger value="location">Τοποθεσία</TabsTrigger>
            <TabsTrigger value="permits">Άδειες & Κατάσταση</TabsTrigger>
            <TabsTrigger value="attachments">Συνημμένα Αρχεία</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Βασικές Πληροφορίες Έργου</CardTitle>
                    </div>
                    <CardDescription>
                        Γενικά στοιχεία και περιγραφή του έργου
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Τίτλος Έργου</Label>
                            <Input defaultValue="3. ΕΥΤΕΡΠΗΣ" className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Τίτλος Άδειας</Label>
                            <Input defaultValue="Τρεις πενταώροφες οικοδομές με καταστήματα πιλοτή & υπόγειο" className="h-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Περιγραφή Έργου</Label>
                        <Textarea
                            rows={4}
                            className="resize-none"
                            defaultValue="Πρόκειται για ένα συγκρότημα τριών πενταόροφων κτιρίων, που βρίσκεται στο όριο του Ευόσμου με τη Νέα Επέκτασή του. Το κτιριολογικό πρόγραμμα περιλαμβάνει συνδυασμό κεντρικής χρήσης με χρήση κατοικίας. Το Συγκρότημα έχει διάταξη Π δημιουργώντας, έτσι, μια αίθρια εσωτερική αυλή που συνδέεται άμεσα με το δημόσιο χώρο της οδού Ευτέρπης. Ο χώρος αυτός διακρίνεται για τον άρτιο σχεδιασμό του και ευνοεί την προσέγγιση των καταστημάτων, που βρίσκονται στη στάθμη του ισογείου, από τους πεζούς."
                        />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="location" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Τοποθεσία</CardTitle>
                    </div>
                    <CardDescription>
                        Στοιχεία τοποθεσίας και διεύθυνσης του έργου
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Νομός</Label>
                            <Select defaultValue="thessaloniki">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thessaloniki">Θεσσαλονίκης</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Πόλη/Δήμος</Label>
                            <Select defaultValue="thessaloniki">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thessaloniki">Θεσσαλονίκη</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Δήμος/Δ. Διαμέρ.</Label>
                            <Select defaultValue="evosmou">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="evosmou">Δήμος Ευόσμου</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-3 space-y-2">
                            <Label className="text-sm font-medium">Διεύθυνση</Label>
                            <div className="flex gap-2">
                                <Input defaultValue="Ευτέρπης 32 - 34" className="h-10" />
                                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                    <Globe className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Ταχυδρομικός Κώδικας</Label>
                            <Input defaultValue="562 24" className="h-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="permits" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Άδειες & Κατάσταση</CardTitle>
                    </div>
                    <CardDescription>
                        Στοιχεία αδειών και τρέχουσα κατάσταση του έργου
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Οικοδομικό Τετράγωνο</Label>
                            <Input defaultValue="10" className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Αρ. Πρωτοκόλλου</Label>
                            <Input placeholder="Εισάγετε αριθμό..." className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Αριθμός Άδειας</Label>
                            <Input defaultValue="5142/24-10-2001" className="h-10 text-primary font-medium" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Αρχή Έκδοσης</Label>
                            <Input placeholder="Εισάγετε αρχή..." className="h-10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Κατάσταση Έργου</Label>
                            <Select defaultValue="constructed">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="constructed">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                Κατασκευασμένα
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Επιλογές</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <Checkbox id="show-on-web" />
                                <Label htmlFor="show-on-web" className="text-sm">Προβολή στο διαδίκτυο</Label>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <Button variant="outline" className="h-10">
                                <Settings className="w-4 h-4 mr-2" />
                                Επιλογή Έργου
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="attachments" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Συνημμένα Αρχεία</CardTitle>
                    </div>
                    <CardDescription>
                        Αρχεία και έγγραφα που σχετίζονται με το έργο
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Χάρτης Περιοχής Έργου</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                defaultValue="\\Server\shared\6. erga\Eterpis_Gen\Eterp_Gen_Images\Eterp_Xartis.jpg"
                                className="h-10 bg-muted/30"
                            />
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Folder className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Γενική Κάτοψη Έργου</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                defaultValue="\\Server\shared\6. erga\TEST\SSSSSS.pdf"
                                className="h-10 bg-muted/30"
                            />
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Folder className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Πίνακας Ποσοστών</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                defaultValue="\\Server\shared\6. erga\TEST\SSSSSSSS.xls"
                                className="h-10 bg-muted/30"
                            />
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Folder className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}

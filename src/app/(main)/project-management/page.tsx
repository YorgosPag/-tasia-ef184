"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Plus,
  FileDown,
  History,
  FilePenLine,
  MapPin,
  BadgeCheck,
  Paperclip,
  Download,
  Pencil,
} from "lucide-react";
import { Label } from "@/components/ui/label";

// Mock data based on the image provided
const projects = [
  {
    id: 1,
    title: "3. ΕΥΤΕΡΠΗΣ",
    subtitle: "Καληαρού & Κομνηνών",
  },
  {
    id: 2,
    title: "Καληαρού & Κομνηνών",
    subtitle: "Κέντρο",
  },
];

const attachedFiles = [
  {
    id: "1",
    name: "Οικοδομική Άδεια.pdf",
    type: "Άδεια",
    date: "2023-01-15",
  },
  {
    id: "2",
    name: "Τοπογραφικό Διάγραμμα.dwg",
    type: "Σχέδιο",
    date: "2022-11-30",
  },
  {
    id: "3",
    name: "Σύμβαση Έργου.docx",
    type: "Συμβατικό",
    date: "2023-02-01",
  },
];

export default function ProjectManagementPage() {
  return (
    <div className="flex gap-4 h-full">
      {/* Left Sidebar for Project List */}
      <Card className="w-80 flex-shrink-0 hidden md:flex md:flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" /> Έργα
          </CardTitle>
          <div className="space-y-1 pt-2">
            <Label>Εταιρεία</Label>
            <Select defaultValue="pagonis">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pagonis">ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 pt-2">
            <Button variant="ghost" size="icon">
              <Plus />
            </Button>
            <Button variant="ghost" size="icon">
              <FileDown />
            </Button>
            <Button variant="ghost" size="icon">
              <History />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
            Τίτλος
          </h3>
          <div className="space-y-1">
            {projects.map((p) => (
              <Button
                key={p.id}
                variant={p.id === 1 ? "secondary" : "ghost"}
                className="w-full justify-start h-auto flex-col items-start px-3 py-2"
              >
                <span className="font-semibold">{p.title}</span>
                <span className="font-normal text-muted-foreground">
                  {p.subtitle}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">3. ΕΥΤΕΡΠΗΣ</h1>
        </div>

        <Tabs defaultValue="building-elements" className="flex-1 flex flex-col">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="general">Γενικά Έργου</TabsTrigger>
            <TabsTrigger value="building-elements">Στοιχεία Δόμησης</TabsTrigger>
            <TabsTrigger value="parking">Θέσεις Στάθμευσης</TabsTrigger>
            <TabsTrigger value="factors">Συντελεστές</TabsTrigger>
            <TabsTrigger value="documents">Έγγραφα Έργου</TabsTrigger>
            <TabsTrigger value="ika">IKA</TabsTrigger>
            <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
            <TabsTrigger value="videos">Βίντεο</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex-1 mt-2">
            <Card className="h-full">
              <Tabs
                defaultValue="info"
                className="w-full h-full flex flex-col"
              >
                <CardHeader>
                  <TabsList className="flex flex-wrap h-auto">
                    <TabsTrigger value="info">Βασικές Πληροφορίες</TabsTrigger>
                    <TabsTrigger value="location">Τοποθεσία</TabsTrigger>
                    <TabsTrigger value="licenses">
                      Άδειες & Κατάσταση
                    </TabsTrigger>
                    <TabsTrigger value="attachments">
                      Συνημμένα Αρχεία
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="info" className="mt-4 flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <FilePenLine className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>Βασικές Πληροφορίες Έργου</CardTitle>
                        <CardDescription>
                          Γενικά στοιχεία και περιγραφή του έργου
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Τίτλος Έργου</Label>
                      <Input readOnly value="3. ΕΥΤΕΡΠΗΣ" />
                    </div>
                    <div className="space-y-2">
                      <Label>Τίτλος Άδειας</Label>
                      <Input
                        readOnly
                        value="Τρεις πενταώροφες οικοδομές με καταστήματα πιλοτή & υπόγειο"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Περιγραφή Έργου</Label>
                      <Textarea
                        readOnly
                        className="min-h-[120px]"
                        value="Πρόκειται για ένα συγκρότημα τριών πενταόροφων κτιρίων, που βρίσκεται στο όριο του Ευόσμου με τη Νέα Επέκτασή του. Το κτιριολογικό πρόγραμμα περιλαμβάνει συνδυασμό κεντρικής χρήσης με χρήση κατοικίας. Το Συγκρότημα έχει διάταξη Π δημιουργώντας, έτσι, μια αίθρια εσωτερική αυλή που συνδέεται άμεσα με το δημόσιο χώρο της οδού Ευτέρπης. Ο χώρος αυτός διακρίνεται για τον άρτιο σχεδιασμό του και ευνοεί την προσέγγιση των καταστημάτων, που βρίσκονται στη στάθμη του ισογείου, από τους πεζούς."
                      />
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="location" className="mt-4 flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>Τοποθεσία & Διεύθυνση</CardTitle>
                        <CardDescription>
                          Γεωγραφικά και διοικητικά στοιχεία του έργου.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Οδός</Label>
                      <Input readOnly value="Καληαρού & Κομνηνών" />
                    </div>
                    <div className="space-y-2">
                      <Label>Περιοχή</Label>
                      <Input readOnly value="Εύοσμος" />
                    </div>
                    <div className="space-y-2">
                      <Label>Πόλη</Label>
                      <Input readOnly value="Θεσσαλονίκη" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ταχ. Κώδικας</Label>
                      <Input readOnly value="56224" />
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="licenses" className="mt-4 flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>Άδειες & Κατάσταση</CardTitle>
                        <CardDescription>
                          Στοιχεία οικοδομικής άδειας και τρέχουσα κατάσταση του
                          έργου.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Αριθμός Άδειας</Label>
                      <Input readOnly value="12345/2023" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ημερομηνία Έκδοσης</Label>
                      <Input readOnly value="15/01/2023" />
                    </div>
                    <div className="space-y-2">
                      <Label>Κατάσταση Έργου</Label>
                      <Input readOnly value="Σε εξέλιξη" />
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="attachments" className="mt-4 flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>Συνημμένα Αρχεία</CardTitle>
                        <CardDescription>
                          Λίστα σχετικών εγγράφων και σχεδίων.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Όνομα Αρχείου</TableHead>
                          <TableHead>Τύπος</TableHead>
                          <TableHead>Ημ/νία</TableHead>
                          <TableHead className="text-right">Λήψη</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attachedFiles.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell className="font-medium">
                              {file.name}
                            </TableCell>
                            <TableCell>{file.type}</TableCell>
                            <TableCell>{file.date}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>
          <TabsContent value="building-elements" className="flex-1 mt-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Pencil className="mr-2 h-4 w-4" /> Επεξεργασία
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="terms">
                  <TabsList>
                    <TabsTrigger value="terms">
                      Όροι Δόμησης Οικοπέδου
                    </TabsTrigger>
                    <TabsTrigger value="allowed">Επιτρεπόμενα</TabsTrigger>
                    <TabsTrigger value="implemented">
                      Πραγματοποιούμενα
                    </TabsTrigger>
                    <TabsTrigger value="other">Λοιπά Στοιχεία</TabsTrigger>
                  </TabsList>
                  <TabsContent value="terms" className="mt-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-6">
                        Όροι Δόμησης Οικοπέδου
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 items-end">
                        {/* Row 1 */}
                        <div className="space-y-2">
                          <Label>Συντελεστής Δόμησης (Χωρίς Κοιν. Συντελ.)</Label>
                          <Input readOnly value="1,80" />
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Ναι" /></SelectTrigger>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Εντός Ορίων" /></SelectTrigger>
                           </Select>
                        </div>
                        <div></div>
                        {/* Row 2 */}
                         <div className="space-y-2">
                          <Label>Κοινωνικός Συντελεστής</Label>
                          <Input readOnly value="1,00" />
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Ναι" /></SelectTrigger>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Εντός Ζώνης" /></SelectTrigger>
                           </Select>
                        </div>
                        <div></div>
                        {/* Row 3 */}
                        <div className="space-y-2">
                          <Label>Συντελεστής Δόμησης (Τελικός)</Label>
                          <Input readOnly value="1,80" />
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Ναι" /></SelectTrigger>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Πυλωτή" /></SelectTrigger>
                           </Select>
                        </div>
                        <div></div>
                         {/* Row 4 */}
                        <div className="space-y-2">
                          <Label>Εμβαδόν Αρτιότητας</Label>
                           <Input readOnly value="0,00" placeholder="τ.μ." />
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Όχι" /></SelectTrigger>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Select disabled>
                              <SelectTrigger><SelectValue placeholder="Στέγη" /></SelectTrigger>
                           </Select>
                        </div>
                        <div></div>
                        {/* Row 5 */}
                         <div className="space-y-2">
                          <Label>Εμβαδόν Αρτιότητας Κατά Παρέκκλιση</Label>
                           <Input readOnly value="0,00" placeholder="τ.μ." />
                        </div>
                         <div className="space-y-2">
                           <Input readOnly value="0,00" placeholder="μ.μ." />
                        </div>
                         <div className="space-y-2">
                          <Label>Μέγιστο Ύψος Στέγης</Label>
                        </div>
                        <div></div>
                         {/* Row 6 */}
                         <div className="space-y-2">
                          <Label>Πρόσωπο Αρτιότητας</Label>
                           <Input readOnly value="0,00" placeholder="μ.μ." />
                        </div>
                         <div className="space-y-2">
                           <Input readOnly value="0,00" placeholder="%" />
                        </div>
                         <div className="space-y-2">
                          <Label>Μέγιστη Κλίση Στέγης</Label>
                        </div>
                        <div></div>
                         {/* Row 7 */}
                        <div className="space-y-2">
                          <Label>Πρόσωπο Αρτιότητας Κατά Παρέκκλιση</Label>
                          <Input readOnly value="0,00" placeholder="μ.μ." />
                        </div>
                        <div className="space-y-2">
                          <Input readOnly value="2.178,90" placeholder="τ.μ." />
                        </div>
                        <div className="space-y-2">
                           <Label>Εμβαδόν Οικοπέδου (Ε.Ο.)</Label>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="parking">
             <Card><CardContent className="p-4">Θέσεις Στάθμευσης</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

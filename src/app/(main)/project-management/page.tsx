
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
import { Checkbox } from "@/components/ui/checkbox";
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
  User,
  Edit,
  Trash2,
  CalendarDays,
  Calculator,
  FileSignature,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { ParkingTab } from "@/components/projects/parking/ParkingTab";
import { parkingSpots } from "@/components/projects/parking/data";

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

const workers = [
  {
    id: "1",
    name: "ΠΑΠΑΔΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ",
    afm: "123456789",
    specialty: "Τεχνίτης",
    familyStatus: "Έγγαμος",
    trieties: "0-6",
    wage: "45,10 €",
  },
  {
    id: "2",
    name: "ΓΕΩΡΓΙΟΥ ΑΝΑΣΤΑΣΙΟΣ",
    afm: "987654321",
    specialty: "Βοηθός",
    familyStatus: "Άγαμος",
    trieties: "0-6",
    wage: "38,00 €",
  },
  {
    id: "3",
    name: "ΔΗΜΗΤΡΙΟΥ ΝΙΚΟΛΑΟΣ",
    afm: "112233445",
    specialty: "Εργάτης",
    familyStatus: "Έγγαμος",
    trieties: "0-6",
    wage: "38,50 €",
  },
  {
    id: "4",
    name: "ΑΝΤΩΝΙΟΥ ΕΛΕΝΗ",
    afm: "223344556",
    specialty: "Τεχνίτης",
    familyStatus: "Άγαμος",
    trieties: "0-6",
    wage: "41,00 €",
  },
  {
    id: "5",
    name: "ΚΩΝΣΤΑΝΤΙΝΟΥ ΜΑΡΙΑ",
    afm: "334455667",
    specialty: "Εργάτης",
    familyStatus: "Άγαμος",
    trieties: "0-6",
    wage: "35,00 €",
  },
  {
    id: "6",
    name: "ΒΑΣΙΛΕΙΟΥ ΠΕΤΡΟΣ",
    afm: "445566778",
    specialty: "Βοηθός",
    familyStatus: "Έγγαμος",
    trieties: "0-6",
    wage: "41,80 €",
  },
];

const apdDeadlines = [
    { month: "Ιανουάριος 2025", deadline: "10/02/2025", status: "Εκκρεμεί" },
    { month: "Φεβρουάριος 2025", deadline: "10/03/2025", status: "Εκκρεμεί" },
    { month: "Μάρτιος 2025", deadline: "10/04/2025", status: "Εκκρεμεί" },
    { month: "Απρίλιος 2025", deadline: "10/05/2025", status: "Εκκρεμεί" },
]

const contributionPayments = [
    { month: "Ιανουάριος 2025", amount: "3.450,60 €", deadline: "28/02/2025", status: "Εκκρεμεί" },
    { month: "Φεβρουάριος 2025", amount: "3.280,00 €", deadline: "31/03/2025", status: "Εκκρεμεί" },
    { month: "Μάρτιος 2025", amount: "3.610,50 €", deadline: "30/04/2025", status: "Εκκρεμεί" },
    { month: "Απρίλιος 2025", amount: "3.390,80 €", deadline: "31/05/2025", status: "Εκκρεμεί" },
]

const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

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

        <Tabs defaultValue="parking" className="flex-1 flex flex-col">
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
                <Tabs defaultValue="other">
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
                  <TabsContent value="allowed" className="mt-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-6">
                        Επιτρεπόμενα Στοιχεία Δόμησης
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 items-center">
                        
                        <Label>Μέγιστη Επιτρεπόμενη Δόμηση</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="3.922,02" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <p className="text-sm text-muted-foreground">= Συντελεστής Δόμησης (Τελικός) * Εμβαδό Οικοπέδου (Ε.Ο.)</p>

                        <Label className="text-green-500">Μέγιστο Ποσοστό Κάλυψης</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="70,00" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <p></p>
                        
                        <Label className="text-green-500">Μέγιστη Κάλυψη Οικοπέδου</Label>
                         <div className="flex items-center gap-1">
                          <Input readOnly value="1.525,23" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <p className="text-sm text-muted-foreground">= Μέγιστο Ποσοστό Κάλυψης * Εμβαδό Οικοπέδου (Ε.Ο.)</p>

                        <Label className="text-red-500">Μέγιστο Ποσοστό Η/Χ</Label>
                         <div className="flex items-center gap-1">
                          <Input readOnly value="15,00" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <p></p>

                         <Label className="text-red-500">Μέγιστη Επιτρεπόμενη Επιφάνεια Η/Χ</Label>
                         <div className="flex items-center gap-1">
                          <Input readOnly value="588,30" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <p className="text-sm text-muted-foreground">= Μέγιστο Ποσοστό Η/Χ * Μέγιστη Επιτρεπόμενη Δόμηση</p>

                         <Label className="text-green-500">Μέγιστο Ποσοστό Εξωστών</Label>
                         <div className="flex items-center gap-1">
                          <Input readOnly value="40,00" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <p></p>

                        <Label>Μέγιστη Επιφάνεια Εξωστών</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="1.568,81" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <p className="text-sm text-muted-foreground">= Μέγιστο Ποσοστό Εξωστών * Μέγιστη Επιτρεπόμενη Δόμηση</p>

                         <Label className="text-cyan-500">Μέγ. Ποσοστό Επιτρεπ. Η/Χ + Εξωστών</Label>
                         <div className="flex items-center gap-1">
                          <Input readOnly value="40,00" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <p></p>

                        <Label className="text-cyan-500">Μέγ. Επιτρεπόμενη Επιφ. Η/Χ & Εξωστών</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="1.568,81" className="flex-1"/>
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <p className="text-sm text-muted-foreground">= Μέγ. Ποσοστό Επιτρεπ. Επιφ. Η/Χ Εξωστών * Μέγιστη Επιτρεπ. Δόμηση</p>

                        <Label className="text-yellow-500">Μέγιστος Συντελεστής Όγκου (Σ.Ο.)</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="5,50" className="flex-1"/>
                        </div>
                        <p></p>

                        <Label className="text-red-500">Μέγιστη Κατ' Όγκο Εκμετάλλευση</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="11.983,95" className="flex-1"/>
                           <span className="text-sm text-muted-foreground">κ.μ.</span>
                        </div>
                        <p className="text-sm text-muted-foreground">= Εμβαδόν Οικοπέδου (Ε.Ο.) * Μέγιστος Συντελεστής Όγκου (Σ.Ο.)</p>
                        
                        <Label>Μέγιστο Επιτρεπόμενο Ύψος</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="17,50" className="flex-1"/>
                           <span className="text-sm text-muted-foreground">m</span>
                        </div>
                        <p></p>

                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="implemented" className="mt-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-6">
                        Πραγματοποιούμενα Στοιχεία Δόμησης Οικοπέδου
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 items-center">
                        {/* Row 1 */}
                        <Label className="text-green-500">Πραγματοποιούμενη Δόμηση</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="3.922,02" className="flex-1" />
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <div></div> {/* Empty div for alignment */}
                        {/* Row 2 */}
                        <Label>Πραγματοποιούμενη Κάλυψη Οικοπέδου / Εμβαδό Οικοπέδου (Ε.Ο.) =</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="67,87" className="flex-1" />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <Label className="text-green-500">Πραγματοποιούμενο Ποσοστό Κάλυψης</Label>
                        {/* Row 3 */}
                        <div></div> {/* Empty div for alignment */}
                        <div className="flex items-center gap-1">
                          <Input readOnly value="1.478,90" className="flex-1" />
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <Label className="text-green-500">Πραγματοποιούμενη Κάλυψη Οικοπέδου</Label>
                        {/* Row 4 */}
                        <Label>Πραγματοποιούμενη Επιφάνεια Η/Χ / Πραγματοποιούμενη Δόμηση =</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="6,27" className="flex-1" />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <Label className="text-orange-500">Πραγματοποιούμενο Ποσοστό Η/Χ</Label>
                        {/* Row 5 */}
                        <div></div> {/* Empty div for alignment */}
                        <div className="flex items-center gap-1">
                          <Input readOnly value="245,89" className="flex-1" />
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <Label className="text-orange-500">Πραγματοποιούμενη Επιφάνεια Η/Χ</Label>
                        {/* Row 6 */}
                        <Label>Πραγματοποιούμενη Επιφάνεια Εξωστών / Πραγματοποιούμενη Δόμηση =</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="11,65" className="flex-1" />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <Label className="text-green-500">Πραγματοποιούμενο Ποσοστό Εξωστών</Label>
                        {/* Row 7 */}
                        <div></div> {/* Empty div for alignment */}
                        <div className="flex items-center gap-1">
                          <Input readOnly value="456,89" className="flex-1" />
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <Label className="text-green-500">Πραγματοποιούμενη Επιφάνεια Εξωστών</Label>
                        {/* Row 8 */}
                        <Label>Πραγματοποιούμενη Επιφ. Η/Χ, Εξωστών / Πραγματοποιούμενη Δόμηση =</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="17,92" className="flex-1" />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <Label className="text-fuchsia-500">Πραγμ. Ποσοστό Επιτρεπ. Επιφάνεια Η/Χ & Εξωστών</Label>
                        {/* Row 9 */}
                        <Label>Πραγματ/μενη Επιφάνεια Η/Χ + Πραγματ/μενη Επιφάνεια Εξωστών =</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="702,78" className="flex-1" />
                          <span className="text-sm text-muted-foreground">τ.μ.</span>
                        </div>
                        <Label className="text-fuchsia-500">Πραγματοποιούμενη Επιφάνεια Η/Χ & Εξωστών</Label>
                        {/* Row 10 */}
                        <div></div> {/* Empty div for alignment */}
                        <div className="flex items-center gap-1">
                          <Input readOnly value="0,00" className="flex-1" />
                        </div>
                        <Label className="text-green-500">Πραγματοποιούμενος Συντελεστής Όγκου (Σ.Ο.)</Label>
                        {/* Row 11 */}
                        <Label>Πραγμ. Κατ 'Όγκο Εκμετάλλευση (Ε.Ο.) * (Σ.Ο.) / Εμβαδό Οικοπέδου (Ε.Ο.) =</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value="0,00" className="flex-1" />
                          <span className="text-sm text-muted-foreground">κ.μ.</span>
                        </div>
                        <Label className="text-red-500">Πραγματοποιούμενη Κατ' Όγκο Εκμετάλλευση</Label>
                        {/* Row 12 */}
                        <div></div> {/* Empty div for alignment */}
                        <div className="flex items-center gap-1">
                          <Input readOnly value="17,50" className="flex-1" />
                          <span className="text-sm text-muted-foreground">m</span>
                        </div>
                        <Label className="text-blue-500">Πραγματοποιούμενο Ύψος</Label>
                      </div>
                    </div>
                  </TabsContent>
                   <TabsContent value="other" className="mt-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Άλλα Στοιχεία</h3>
                       <p className="text-sm text-muted-foreground mb-6">Οικονομικά στοιχεία και παρακολούθηση της προόδου του έργου.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Τιμή Πώλησης Ανά τ.μ.</Label>
                            <Input readOnly value="0,00 €" className="w-40"/>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Κόστος Ανά τ.μ. Δόμησης</Label>
                            <Input readOnly value="0,00 €" className="w-40"/>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Αξία Πραγματοποιηθέντος Έργου</Label>
                            <Input readOnly value="3.922.222,00 €" className="w-40"/>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Απαιτούμενο Ποσό Αποπεράτωσης</Label>
                            <Input readOnly value="-3.922.222,00 €" className="w-40"/>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Χρηματοδότηση Έργου</Label>
                            <Input readOnly value="0,00 €" className="w-40"/>
                          </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                            <Label>Μικτά Εκτός Κλιμακοστασίου</Label>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">τ.μ.</span>
                                <Input readOnly value="0,00" className="w-32"/>
                             </div>
                          </div>
                           <div className="flex items-center justify-between">
                            <Label>Εμβαδόν Που Ανάγεται</Label>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">τ.μ.</span>
                                <Input readOnly value="0,00" className="w-32"/>
                             </div>
                          </div>
                           <div className="flex items-center justify-between">
                            <Label>Εμβαδόν Πραγμ. Δόμησης & Αναγωγής</Label>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">τ.μ.</span>
                                <Input readOnly value="0,00" className="w-32"/>
                             </div>
                          </div>
                           <div className="flex items-center justify-between">
                            <Label>Εκτιμώμενο Κόστος Έργου</Label>
                            <Input readOnly value="0,00 €" className="w-40"/>
                          </div>
                           <div className="flex items-center justify-between">
                            <Label>Ποσοστό Προόδου Έργου</Label>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">%</span>
                                <Input readOnly value="0,00" className="w-32"/>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="parking" className="mt-4 flex-1">
             <ParkingTab parkingSpots={parkingSpots} />
          </TabsContent>
           <TabsContent value="ika" className="flex-1 mt-2 flex flex-col gap-4">
             <Tabs defaultValue="worker-management" className="w-full">
                <TabsList>
                  <TabsTrigger value="worker-management">Εργατοτεχνίτες</TabsTrigger>
                  <TabsTrigger value="payroll">Παρουσιολόγιο</TabsTrigger>
                  <TabsTrigger value="insurance">Υπολογισμός Ενσήμων</TabsTrigger>
                   <TabsTrigger value="apd">ΑΠΔ & Πληρωμές</TabsTrigger>
                </TabsList>
                <TabsContent value="worker-management" className="mt-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Προσθήκη / Επεξεργασία Εργατοτεχνίτη</CardTitle>
                            </div>
                            <CardDescription>Συμπληρώστε τα στοιχεία του εργατοτεχνίτη για να τον προσθέσετε στο έργο.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="worker-name">Όνομα/Επωνυμία</Label>
                                    <Input id="worker-name" placeholder="Εισάγετε το ονοματεπώνυμο" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="worker-afm">ΑΦΜ</Label>
                                    <Input id="worker-afm" placeholder="Εισάγετε το ΑΦΜ" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ειδικότητα</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Επιλογή ειδικότητας" /></SelectTrigger></Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Οικογενειακή Κατάσταση</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Επιλογή κατάστασης" /></SelectTrigger></Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Τριετίες</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Επιλογή τριετιών" /></SelectTrigger></Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Υπολογιζόμενο Ημερομίσθιο</Label>
                                    <Input readOnly value="0,00 €" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Προσθήκη Εργατοτεχνίτη
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Λίστα Εργατοτεχνιτών</CardTitle>
                            <CardDescription>Οι εργατοτεχνίτες που έχουν καταχωρηθεί στο έργο.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Όνομα/Επωνυμία</TableHead>
                                        <TableHead>ΑΦΜ</TableHead>
                                        <TableHead>Ειδικότητα</TableHead>
                                        <TableHead>Οικ. Κατάσταση</TableHead>
                                        <TableHead>Τριετίες</TableHead>
                                        <TableHead>Ημερομίσθιο</TableHead>
                                        <TableHead className="text-right">Ενέργειες</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workers.map((worker) => (
                                        <TableRow key={worker.id}>
                                            <TableCell>{worker.name}</TableCell>
                                            <TableCell>{worker.afm}</TableCell>
                                            <TableCell>{worker.specialty}</TableCell>
                                            <TableCell>{worker.familyStatus}</TableCell>
                                            <TableCell>{worker.trieties}</TableCell>
                                            <TableCell>{worker.wage}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="payroll" className="mt-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        <CardTitle>Παρουσιολόγιο Εργατοτεχνίτη</CardTitle>
                      </div>
                      <CardDescription>
                        Επιλέξτε μήνα, έτος και εργατοτεχνίτη για να καταχωρήσετε τις ημέρες εργασίας.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Έτος</Label>
                          <Select defaultValue="2025">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2025">2025</SelectItem>
                              <SelectItem value="2024">2024</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Μήνας</Label>
                          <Select defaultValue="august">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="august">Αύγουστος</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Εργατοτεχνίτης</Label>
                           <Select defaultValue="papadopoulos">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="papadopoulos">ΠΑΠΑΔΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
                          <span>ΔΕΥ</span>
                          <span>ΤΡΙ</span>
                          <span>ΤΕΤ</span>
                          <span>ΠΕΜ</span>
                          <span>ΠΑΡ</span>
                          <span>ΣΑΒ</span>
                          <span>ΚΥΡ</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {/* Empty cells for month start */}
                          <div />
                          <div />
                          <div />
                          <div />
                          {daysInMonth.map(day => (
                            <div key={day} className="p-2 border rounded-md h-16 flex flex-col items-center justify-center gap-1">
                              <span className="text-sm font-medium">{day}</span>
                              <Checkbox id={`day-${day}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end">
                         <Button variant="destructive">
                            <Download className="mr-2 h-4 w-4" />
                           Αποθήκευση Παρουσιολογίου
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                 <TabsContent value="insurance" className="mt-4 space-y-6">
                   <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            <CardTitle>Υπολογισμός Εισφορών</CardTitle>
                        </div>
                        <CardDescription>Συμπληρώστε τα παρακάτω πεδία για να υπολογίσετε τις ασφαλιστικές εισφορές.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                             <div className="space-y-2 md:col-span-2">
                                <Label>Εργατοτεχνίτης</Label>
                                <Select defaultValue="papadopoulos">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="papadopoulos">ΠΑΠΑΔΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ</SelectItem></SelectContent>
                                </Select>
                                <p className="text-sm text-red-500">Επιλεγμένο Ημερομίσθιο: 65,50 €</p>
                             </div>
                             <div className="space-y-2">
                                <Label>Έτος</Label>
                                <Select defaultValue="2025">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                     <SelectContent><SelectItem value="2025">2025</SelectItem></SelectContent>
                                </Select>
                             </div>
                              <div className="space-y-2">
                                <Label>Μήνας</Label>
                                <Select defaultValue="august">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                     <SelectContent><SelectItem value="august">Αύγουστος</SelectItem></SelectContent>
                                </Select>
                             </div>
                              <div className="space-y-2">
                                <Label>Ημέρες Εργασίας</Label>
                                <Input type="number" defaultValue="0" />
                             </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="destructive">
                                <Calculator className="mr-2 h-4 w-4" />
                                Υπολογισμός
                            </Button>
                        </div>
                    </CardContent>
                   </Card>
                </TabsContent>
                <TabsContent value="apd" className="mt-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Προθεσμίες Υποβολής ΑΠΔ</CardTitle>
                            <CardDescription>Παρακολούθηση της κατάστασης υποβολής των Αναλυτικών Περιοδικών Δηλώσεων.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Μήνας</TableHead>
                                        <TableHead>Προθεσμία Υποβολής</TableHead>
                                        <TableHead>Κατάσταση</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {apdDeadlines.map(item => (
                                        <TableRow key={item.month}>
                                            <TableCell>{item.month}</TableCell>
                                            <TableCell>{item.deadline}</TableCell>
                                            <TableCell><Button variant="destructive" size="sm">{item.status}</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-end">
                                <Button variant="destructive">
                                    <FileSignature className="mr-2 h-4 w-4" />
                                    Δημιουργία Αρχείου ΑΠΔ
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Κατάσταση Πληρωμής Εισφορών</CardTitle>
                            <CardDescription>Παρακολούθηση της κατάστασης πληρωμής των ασφαλιστικών εισφορών.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Μήνας</TableHead>
                                        <TableHead>Ποσό Εισφορών</TableHead>
                                        <TableHead>Προθεσμία Πληρωμής</TableHead>
                                        <TableHead>Κατάσταση</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contributionPayments.map(item => (
                                        <TableRow key={item.month}>
                                            <TableCell>{item.month}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell>{item.deadline}</TableCell>
                                            <TableCell><Button variant="destructive" size="sm">{item.status}</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <div className="flex justify-end">
                                <Button variant="destructive">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Καταχώρηση Πληρωμής
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

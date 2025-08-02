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
import {
  Copy,
  Eye,
  FolderArchive,
  Plus,
  FileDown,
  History,
  Globe,
  MapPin,
  Briefcase,
  FilePenLine,
  Landmark,
  Square,
  Building,
  ParkingSquare,
  FileText,
  Camera,
  Video,
  Settings2,
  List,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
    title: "Χάρτης Περιοχής Έργου",
    path: "\\\\Server\\shared\\6. erga\\Eterpis_Gen\\Eterp_Gen_Images\\Eterp_Xartis.jpg",
  },
  {
    title: "Γενική Κάτοψη Έργου",
    path: "\\\\Server\\shared\\6. erga\\TEST\\SSSSSS.pdf",
  },
  {
    title: "Πίνακας Ποσοστών",
    path: "\\\\Server\\shared\\6. erga\\TEST\\SSSSSSSS.xls",
  },
];

export default function ProjectManagementPage() {
  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

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

        <Tabs defaultValue="general" className="flex-1 flex flex-col">
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
              <Tabs defaultValue="licenses" className="w-full h-full flex flex-col">
                <CardHeader>
                  <TabsList className="flex flex-wrap h-auto">
                    <TabsTrigger value="info">Βασικές Πληροφορίες</TabsTrigger>
                    <TabsTrigger value="location">Τοποθεσία</TabsTrigger>
                    <TabsTrigger value="licenses">Άδειες & Κατάσταση</TabsTrigger>
                    <TabsTrigger value="attachments">Συνημμένα Αρχεία</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="licenses" className="mt-4 flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <FilePenLine className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>Άδειες & Κατάσταση</CardTitle>
                        <CardDescription>
                          Στοιχεία αδειών και τρέχουσα κατάσταση του έργου
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <Label>Οικοδομικό Τετράγωνο</Label>
                      <Input readOnly value="10" />
                    </div>
                    <div className="space-y-1">
                      <Label>Αρ. Πρωτοκόλλου</Label>
                      <Input placeholder="Εισάγετε αριθμό..." />
                    </div>
                     <div className="space-y-1">
                      <Label>Αριθμός Άδειας</Label>
                      <Input readOnly value="5142/24-10-2001" />
                    </div>
                     <div className="space-y-1">
                      <Label>Αρχή Έκδοσης</Label>
                      <Input placeholder="Εισάγετε αρχή..." />
                    </div>
                     <div className="space-y-1">
                      <Label>Κατάσταση Έργου</Label>
                       <Select defaultValue="built">
                         <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="built">Κατασκευασμένα</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                     <div className="space-y-1 pt-5 flex items-center gap-2">
                      <Checkbox id="publish" />
                       <Label htmlFor="publish">Προβολή στο διαδίκτυο</Label>
                    </div>
                     <div className="space-y-1 pt-5 flex items-start">
                       <Button variant="outline"><Settings2 className="mr-2 h-4 w-4" /> Επιλογή Έργου</Button>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

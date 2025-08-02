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
import {
  Copy,
  Eye,
  FolderArchive,
  Plus,
  FileDown,
  History,
} from "lucide-react";

// Mock data based on the image provided
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

const projects = [
  { id: 1, title: "3. ΕΥΤΕΡΠΗΣ", subtitle: "Καληαρού & Κομνηνών" },
  { id: 2, title: "Καληαρού & Κομνηνών", subtitle: "Κέντρο" },
];

export default function ProjectManagementPage() {
  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Left Sidebar for Project List */}
      <Card className="w-80 flex-shrink-0">
        <CardHeader>
          <CardTitle>Έργα</CardTitle>
          <div className="space-y-1 pt-2">
            <label className="text-sm font-medium">Εταιρεία</label>
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
        <CardContent>
          <h3 className="text-sm font-semibold mb-2">Τίτλος</h3>
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
          <TabsList>
            <TabsTrigger value="general">Γενικά Έργου</TabsTrigger>
            <TabsTrigger value="structure">Στοιχεία Δόμησης</TabsTrigger>
            <TabsTrigger value="parking">Θέσεις Στάθμευσης</TabsTrigger>
            <TabsTrigger value="factors">Συντελεστές</TabsTrigger>
            <TabsTrigger value="documents">Έγγραφα Έργου</TabsTrigger>
            <TabsTrigger value="ika">IKA</TabsTrigger>
            <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
            <TabsTrigger value="videos">Βίντεο</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex-1 mt-2">
            <Card className="h-full">
              <Tabs defaultValue="attachments" className="w-full h-full flex flex-col">
                <CardHeader>
                  <TabsList>
                    <TabsTrigger value="info">Βασικές Πληροφορίες</TabsTrigger>
                    <TabsTrigger value="location">Τοποθεσία</TabsTrigger>
                    <TabsTrigger value="licenses">Άδειες & Κατάσταση</TabsTrigger>
                    <TabsTrigger value="attachments">Συνημμένα Αρχεία</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="attachments" className="mt-4 flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FolderArchive className="h-6 w-6" />
                      <div>
                        <CardTitle>Συνημμένα Αρχεία</CardTitle>
                        <CardDescription>
                          Αρχεία και έγγραφα που σχετίζονται με το έργο
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-6 space-y-4">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="space-y-1">
                        <label className="text-sm font-medium">
                          {file.title}
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={file.path}
                            className="bg-muted/50"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyPath(file.path)}
                            title="Αντιγραφή διαδρομής"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Προβολή αρχείου"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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

// Dummy Input component to avoid breaking the code, as it's not in the scope
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

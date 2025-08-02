"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Eye, FolderArchive } from "lucide-react";

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

export default function ProjectManagementPage() {
  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">3. ΕΥΤΕΡΠΗΣ</h1>
      </div>

      <Tabs defaultValue="general">
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

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <Tabs defaultValue="attachments" className="w-full">
                <TabsList>
                  <TabsTrigger value="info">Βασικές Πληροφορίες</TabsTrigger>
                  <TabsTrigger value="location">Τοποθεσία</TabsTrigger>
                  <TabsTrigger value="licenses">Άδειες & Κατάσταση</TabsTrigger>
                  <TabsTrigger value="attachments">Συνημμένα Αρχεία</TabsTrigger>
                </TabsList>
                <TabsContent value="attachments" className="mt-4">
                  <div className="flex items-center gap-2">
                    <FolderArchive className="h-6 w-6" />
                    <div>
                      <CardTitle>Συνημμένα Αρχεία</CardTitle>
                      <CardDescription>
                        Αρχεία και έγγραφα που σχετίζονται με το έργο
                      </CardDescription>
                    </div>
                  </div>
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
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
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

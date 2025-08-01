"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { processImportFile } from "@/lib/importer";
import { useToast } from "@/hooks/use-toast";
import { exportToCsv, exportToJson } from "@/lib/exporter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlgoliaSearchBox } from "./AlgoliaSearchBox";

async function fetchListTypes(): Promise<string[]> {
  const snapshot = await getDocs(
    query(collection(db, "tsia-list-types"), orderBy("name")),
  );
  return snapshot.docs.map((doc) => doc.data().name as string);
}

export function ComplexEntitiesTab() {
  const { toast } = useToast();
  const [listTypes, setListTypes] = React.useState<string[]>([]);
  const [isLoadingListTypes, setIsLoadingListTypes] = React.useState(true);
  const [selectedListType, setSelectedListType] = React.useState<string>("");

  const [isImporting, setIsImporting] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [newListName, setNewListName] = React.useState("");
  const [algoliaHits, setAlgoliaHits] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function getListTypes() {
      setIsLoadingListTypes(true);
      const types = await fetchListTypes();
      setListTypes(types);
      setIsLoadingListTypes(false);
    }
    getListTypes();
  }, []);

  React.useEffect(() => {
    if (!isLoadingListTypes && listTypes.length > 0 && !selectedListType) {
      const preferredList = "Διοικητική Διαίρεση Ελλάδας";
      if (listTypes.includes(preferredList)) {
        setSelectedListType(preferredList);
      } else if (listTypes[0]) {
        setSelectedListType(listTypes[0]);
      }
    }
  }, [isLoadingListTypes, listTypes, selectedListType]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !newListName.trim()) {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Παρακαλώ δώστε όνομα λίστας και επιλέξτε ένα αρχείο.",
      });
      return;
    }

    setIsImporting(true);
    toast({
      title: "Η εισαγωγή ξεκίνησε",
      description:
        "Η λίστα σας επεξεργάζεται στο παρασκήνιο. Μπορείτε να συνεχίσετε την εργασία σας.",
    });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("listName", newListName);

      const result = await processImportFile(formData);

      if (result.errors.length > 0) {
        toast({
          variant: "destructive",
          title: `Η εισαγωγή ολοκληρώθηκε με ${result.errors.length} σφάλματα`,
          description: `Το αρχείο καταγραφής είναι έτοιμο για λήψη.`,
          duration: 10000,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportToCsv(
                  result.errors.map((e) => ({
                    row: e.row,
                    ...e.rowData,
                    error: e.message,
                  })),
                  `${newListName}-import-errors`,
                );
              }}
            >
              Λήψη
            </Button>
          ),
        });
      } else {
        toast({
          title: "Επιτυχής Εισαγωγή",
          description: `Η λίστα "${newListName}" δημιουργήθηκε με ${result.unitsCreated} εγγραφές.`,
        });
      }
      setNewListName("");
      setSelectedFile(null);
      const fileInput = document.getElementById(
        "import-file-input",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refetch list types to include the new one
      const types = await fetchListTypes();
      setListTypes(types);
      setSelectedListType(newListName);
    } catch (error: any) {
      console.error("Import failed:", error);
      toast({
        variant: "destructive",
        title: "Η εισαγωγή απέτυχε",
        description: error.message || "Υπήρξε ένα απρόβλεπτο σφάλμα.",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = (format: "csv" | "json") => {
    const dataToExport = algoliaHits.map((hit) => {
      const { _highlightResult, ...rest } = hit;
      return rest;
    });

    if (format === "csv") {
      exportToCsv(dataToExport, selectedListType);
    } else {
      exportToJson(dataToExport, selectedListType);
    }
  };

  const handleHitsChange = React.useCallback((hits: any[]) => {
    setAlgoliaHits(hits);
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Εισαγωγή Σύνθετης Λίστας</CardTitle>
          <CardDescription>
            Ανεβάστε ένα αρχείο .xlsx ή .csv για μαζική εισαγωγή δεδομένων. Η
            πρώτη γραμμή πρέπει να περιέχει τις επικεφαλίδες.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Input
            placeholder="Όνομα Νέας Λίστας..."
            className="max-w-xs"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            disabled={isImporting}
          />
          <Input
            id="import-file-input"
            type="file"
            className="max-w-xs"
            onChange={handleFileChange}
            accept=".xlsx, .csv"
            disabled={!newListName.trim() || isImporting}
          />
          <Button
            onClick={handleImport}
            disabled={!selectedFile || !newListName.trim() || isImporting}
          >
            {isImporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isImporting ? "Γίνεται Εισαγωγή..." : "Έναρξη Εισαγωγής"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Κατάλογος Οντοτήτων</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
                disabled={algoliaHits.length === 0}
              >
                Εξαγωγή CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("json")}
                disabled={algoliaHits.length === 0}
              >
                Εξαγωγή JSON
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Select
              onValueChange={setSelectedListType}
              value={selectedListType}
            >
              <SelectTrigger className="w-full md:w-[350px]">
                <SelectValue
                  placeholder={
                    isLoadingListTypes
                      ? "Φόρτωση λιστών..."
                      : "Επιλέξτε λίστα..."
                  }
                >
                  {isLoadingListTypes ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />{" "}
                      <span>Φόρτωση...</span>
                    </div>
                  ) : (
                    selectedListType || "Επιλέξτε λίστα..."
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {isLoadingListTypes ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : listTypes.length > 0 ? (
                  listTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))
                ) : (
                  <p className="p-2 text-xs text-muted-foreground">
                    Δεν βρέθηκαν λίστες.
                  </p>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedListType ? (
            <AlgoliaSearchBox
              indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
              listType={selectedListType}
              onHitsChange={handleHitsChange}
            />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Παρακαλώ επιλέξτε μια λίστα για να δείτε τα δεδομένα.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

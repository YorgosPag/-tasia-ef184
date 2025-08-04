"use client";

import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Eye } from "lucide-react";
import { Contact } from "@/hooks/use-contacts";
import { uploadFile } from "@/lib/utils/uploadFile";

const ContractStageFields = ({
  nestIndex,
  stage,
  title,
  control,
  contacts,
  setValue,
}: {
  nestIndex: number;
  stage: "preliminary" | "final" | "settlement";
  title: string;
  control: any;
  contacts: Contact[];
  setValue: Function;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const onFileUpload = async (field: string, file: File) => {
    // Assuming a path structure, adjust as needed
    const path = `unit_contracts/stage_files/${file.name}_${Date.now()}`;
    const url = await uploadFile(path, file);
    setValue(field, url, { shouldDirty: true });
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await onFileUpload(`contracts.${nestIndex}.${stage}.contractFileUrl`, file);
      setIsUploading(false);
    }
  };

  const fileUrl = control.getValues(`contracts.${nestIndex}.${stage}.contractFileUrl`);

  return (
    <div className="space-y-4 rounded-md border p-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`contracts.${nestIndex}.${stage}.contractNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Αριθμός Συμβολαίου</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`contracts.${nestIndex}.${stage}.contractDate`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ημερ. Συμβολαίου</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Επιλογή ημερομηνίας</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`contracts.${nestIndex}.${stage}.notary`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Συμβολαιογράφος</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε επαφή..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contacts
                    .filter((c) => c.job?.role === "Notary")
                    .map((c) => (
                      <SelectItem key={c.id} value={c.name || ""}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`contracts.${nestIndex}.${stage}.lawyer`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Δικηγόρος</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε επαφή..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contacts
                    .filter((c) => c.job?.role === "Lawyer")
                    .map((c) => (
                      <SelectItem key={c.id} value={c.name || ""}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="col-span-full">
          <FormLabel>Αρχείο Συμβολαίου (PDF)</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf"
              className="text-xs h-9"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {fileUrl && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </FormItem>
      </div>
    </div>
  );
};

export function ContractStageForm({
  nestIndex,
  contacts,
  control,
}: {
  nestIndex: number;
  contacts: Contact[];
  control: any;
}) {
  return (
    <>
      <FormField
        control={control}
        name={`contracts.${nestIndex}.clientName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Πελάτης</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ContractStageFields
        nestIndex={nestIndex}
        stage="preliminary"
        title="Προσύμφωνο"
        contacts={contacts}
        control={control}
        setValue={control.setValue}
      />
      <ContractStageFields
        nestIndex={nestIndex}
        stage="final"
        title="Οριστικό Συμβόλαιο"
        contacts={contacts}
        control={control}
        setValue={control.setValue}
      />
      <ContractStageFields
        nestIndex={nestIndex}
        stage="settlement"
        title="Εξοφλητικό Συμβόλαιο"
        contacts={contacts}
        control={control}
        setValue={control.setValue}
      />

      <FormField
        control={control}
        name={`contracts.${nestIndex}.registeredBy`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Καταχωρήθηκε από</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

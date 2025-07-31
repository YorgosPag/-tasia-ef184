import type { UseFormReturn } from "react-hook-form";
import type { ContactFormValues } from "@/lib/validation/contactSchema";

export interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  onFileSelect: (file: File | null) => void;
  openSections?: string[];
  onOpenChange?: (value: string[]) => void;
}

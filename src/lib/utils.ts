import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import type { Company } from "@/hooks/use-data-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timestamp?: Timestamp | Date) => {
  if (!timestamp) return "-";
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return format(date, "dd/MM/yyyy", { locale: el });
};

export const getStatusVariant = (status: string) => {
  switch (status) {
    case "Ολοκληρωμένο":
      return "default";
    case "Σε εξέλιξη":
      return "secondary";
    case "Ενεργό":
      return "outline";
    default:
      return "outline";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "Ολοκληρωμένο":
      return "✅ Ολοκληρωμένο";
    case "Σε εξέλιξη":
      return "🚧 Σε εξέλιξη";
    case "Ενεργό":
      return "🔥 Ενεργό";
    default:
      return status;
  }
};

export const getCompanyName = (companyId: string, companies: Company[]) => {
  if (!companyId) return "Άγνωστη εταιρεία";
  return companies.find((c) => c.id === companyId)?.name || companyId;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
"use client";

import { format } from "date-fns";
import { el } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { Company } from "@/hooks/use-data-store";

export const formatDate = (timestamp: Timestamp | Date | undefined) => {
  if (!timestamp) return "N/A";
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(date.getTime())) return "Invalid Date";
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

export const getCompanyName = (companyId: string, companies?: Company[]) => {
  if (!companyId || !companies) return "Άγνωστη εταιρεία";
  return companies.find((c) => c.id === companyId)?.name || companyId;
};

export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

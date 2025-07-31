"use client";
import { useWatch, type UseFormReturn } from "react-hook-form";

export function useWatchedFields(form: UseFormReturn<any>) {
  return {
    entityType: useWatch({ control: form.control, name: "entityType" }),
    statuses: useWatch({ control: form.control, name: "job.statuses" }) || [],
    branches: useWatch({ control: form.control, name: "job.branches" }) || [],
    companyVersions:
      useWatch({ control: form.control, name: "job.companyVersions" }) || [],
    docSummary:
      useWatch({ control: form.control, name: "job.docSummary" }) || [],
    externalLinks:
      useWatch({ control: form.control, name: "job.externalLinks" }) || [],
    registrationType: useWatch({
      control: form.control,
      name: "job.registrationType",
    }),
    branchType: useWatch({ control: form.control, name: "job.branchType" }),
    addresses: useWatch({ control: form.control, name: "addresses" }) || [],
  };
}

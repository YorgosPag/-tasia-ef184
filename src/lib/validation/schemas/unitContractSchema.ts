"use client";

import { z } from "zod";

const contractStageSchema = z.object({
  contractNumber: z.string().optional(),
  contractDate: z.date().optional().nullable(),
  contractFileUrl: z.string().url().or(z.literal("")).optional(),
  notary: z.string().optional(),
  lawyer: z.string().optional(),
});

export const unitContractSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(1, "Το όνομα πελάτη είναι υποχρεωτικό."),
  status: z.string().optional(),
  preliminary: contractStageSchema.optional(),
  final: contractStageSchema.optional(),
  settlement: contractStageSchema.optional(),
  registeredBy: z.string().optional(),
});

export type UnitContract = z.infer<typeof unitContractSchema>;

export const formSchema = z.object({
  contracts: z.array(unitContractSchema),
});

export type FormValues = z.infer<typeof formSchema>;

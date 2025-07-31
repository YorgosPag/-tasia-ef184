import { z } from "zod";

export const jobInfoSchema = z.object({
  job: z
    .object({
      role: z.string().optional(),
      specialty: z.string().optional(),
      title: z.string().optional(),
      arGemi: z.string().optional(),
      // GEMH Fields
      companyName: z.string().optional(),
      companyTitle: z.string().optional(),
      commercialTitle: z.string().optional(),
      objective: z.string().optional(),
      gemhStatus: z.string().optional(),
      gemhDate: z.string().optional(),
      gemhAddress: z.string().optional(),
      gemhActivity: z.string().optional(),
      gemhDOY: z.string().optional(),
      gemhGemiOffice: z.string().optional(),
      isBranch: z.boolean().optional(),
      autoRegistered: z.boolean().optional(),
      legalType: z.string().optional(),
      prefecture: z.string().optional(),
      initialRegistrationDate: z.string().optional(),
      registrationType: z.string().optional(),
      branchType: z.string().optional(),
      statuses: z
        .array(
          z.object({
            status: z.string().optional(),
            statusDate: z.string().optional(),
          }),
        )
        .optional(),
      branches: z
        .array(
          z.object({
            address: z.string().optional(),
            number: z.string().optional(),
            postalCode: z.string().optional(),
            municipality: z.string().optional(),
            status: z.string().optional(),
            established: z.string().optional(),
          }),
        )
        .optional(),
      companyVersions: z
        .array(
          z.object({
            versionDate: z.string().optional(),
            description: z.string().optional(),
          }),
        )
        .optional(),
      docSummary: z
        .array(
          z.object({
            type: z.string().optional(),
            date: z.string().optional(),
            subject: z.string().optional(),
            url: z.string().optional(),
          }),
        )
        .optional(),
      externalLinks: z
        .array(
          z.object({
            label: z.string().optional(),
            url: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});


import { z } from 'zod';

export const identityTaxSchema = z.object({
  // ID & Tax Info
  identity: z.object({
    type: z.string().optional(),
    number: z.string().optional(),
    issueDate: z.date().optional().nullable(),
    issuingAuthority: z.string().optional(),
  }).optional(),
  afm: z.string()
    .optional()
    .refine(val => !val || /^\d{9}$/.test(val), {
        message: 'Το ΑΦΜ πρέπει να αποτελείται από ακριβώς 9 ψηφία.'
    }),
  doy: z.string().optional(),
});

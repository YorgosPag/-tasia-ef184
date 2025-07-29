
import { z } from 'zod';
import { getValidationRule } from '@/hooks/useDocumentNumberMask';
import { personalInfoSchema } from './schemas/personalInfoSchema';
import { identityTaxSchema } from './schemas/identityTaxSchema';
import { contactInfoSchema } from './schemas/contactInfoSchema';
import { socialsSchema } from './schemas/socialsSchema';
import { addressSchema } from './schemas/addressSchema';
import { jobInfoSchema } from './schemas/jobInfoSchema';
import { notesSchema } from './schemas/notesSchema';

export const ALL_ACCORDION_SECTIONS = ['personal', 'identity', 'contact', 'socials', 'addresses', 'job', 'notes', 'representative'];

// Full combined schema
export const contactSchema = personalInfoSchema
  .merge(identityTaxSchema)
  .merge(contactInfoSchema)
  .merge(socialsSchema)
  .merge(addressSchema)
  .merge(jobInfoSchema)
  .merge(notesSchema)
  .superRefine((data, ctx) => {
    if (data.entityType === 'Φυσικό Πρόσωπο') {
        if (!data.firstName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['firstName'],
                message: 'Το όνομα είναι υποχρεωτικό για φυσικά πρόσωπα.',
            });
        }
        if (!data.lastName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['lastName'],
                message: 'Το επώνυμο είναι υποχρεωτικό για φυσικά πρόσωπα.',
            });
        }
        
        // Dynamic validation for identity number
        if (data.identity?.type && data.identity?.number) {
            const rule = getValidationRule(data.identity.type);
            if (rule.pattern && !rule.pattern.test(data.identity.number)) {
                 ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['identity.number'],
                    message: `Μη έγκυρη μορφή. Αναμενόμενη μορφή: ${rule.placeholder}`,
                });
            }
        }

        if(!data.identity?.issuingAuthority) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['identity.issuingAuthority'],
                message: 'Η εκδούσα αρχή είναι υποχρεωτική.',
            });
        }
    }
  });


export type ContactFormValues = z.infer<typeof contactSchema>;

export type EntityType = 'individual' | 'legal' | 'public';


import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Το όνομα/επωνυμία είναι υποχρεωτικό.'),
  entityType: z.enum(['Φυσικό Πρόσωπο', 'Νομικό Πρόσωπο', 'Δημ. Υπηρεσία']),
  
  // Personal Info fields - conditionally applied
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  birthDate: z.date().optional().nullable(),
  birthPlace: z.string().optional(),
  gender: z.enum(['Άνδρας', 'Γυναίκα', 'Άλλο']).optional(),
  nationality: z.string().optional(),
  photoUrl: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
});

export const identityTaxSchema = z.object({
  // ID & Tax Info
  identity: z.object({
    type: z.enum(['Ταυτότητα', 'Διαβατήριο']).optional(),
    number: z.string().optional(),
    issueDate: z.date().optional().nullable(),
    issuingAuthority: z.string().optional(),
  }).optional(),
  afm: z.string().optional(),
  doy: z.string().optional(),
});

export const contactInfoSchema = z.object({
  contactInfo: z.object({
    email: z.string().email('Μη έγκυρο email').or(z.literal('')).optional(),
    phone: z.string().optional(),
    landline: z.string().optional(),
  }).optional(),
});

export const socialsSchema = z.object({
  socials: z.object({
    website: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    linkedin: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    facebook: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    instagram: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    tiktok: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
  }).optional(),
});

export const addressSchema = z.object({
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    municipality: z.string().optional(),
  }).optional(),
});

export const jobInfoSchema = z.object({
  job: z.object({
    role: z.string().optional(),
    specialty: z.string().optional(),
    title: z.string().optional(),
    companyName: z.string().optional(),
  }).optional(),
});

export const notesSchema = z.object({
  notes: z.string().optional(),
});

// Full combined schema
export const contactSchema = personalInfoSchema
  .merge(identityTaxSchema)
  .merge(contactInfoSchema)
  .merge(socialsSchema)
  .merge(addressSchema)
  .merge(jobInfoSchema)
  .merge(notesSchema);

export type ContactFormValues = z.infer<typeof contactSchema>;

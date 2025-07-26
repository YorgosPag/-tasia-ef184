import { z } from 'zod';

export const personalInfoSchema = z.object({
  id: z.string().optional(), // Keep ID for editing context
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
    emails: z.array(z.object({
        type: z.enum(['Προσωπικό', 'Επαγγελματικό']).default('Προσωπικό'),
        value: z.string().email({ message: 'Μη έγκυρο email.' }).or(z.literal('')),
    })).optional(),
    phones: z.array(z.object({
        type: z.enum(['Κινητό', 'Σταθερό', 'Επαγγελματικό']).default('Κινητό'),
        value: z.string().min(1, { message: 'Ο αριθμός είναι υποχρεωτικός.' }),
        indicators: z.array(z.enum(['Viber', 'WhatsApp', 'Telegram'])).optional(),
    })).optional(),
});


export const socialsSchema = z.object({
    socials: z.array(z.object({
        type: z.enum(['Website', 'LinkedIn', 'Facebook', 'Instagram', 'TikTok']).default('Website'),
        url: z.string().url({ message: 'Μη έγκυρο URL.' }).or(z.literal('')),
    })).optional(),
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
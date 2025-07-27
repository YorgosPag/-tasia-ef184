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

export const contactInfoSchema = z.object({
    emails: z.array(z.object({
        type: z.string().default('Προσωπικό'),
        value: z.string().email({ message: 'Μη έγκυρη διεύθυνση email.' }).or(z.literal('')),
    })).optional(),
    phones: z.array(z.object({
        type: z.string().default('Κινητό'),
        countryCode: z.string().optional().default('+30'),
        value: z.string()
          .min(1, { message: 'Ο αριθμός είναι υποχρεωτικός.' })
          .refine(val => /^\d+$/.test(val), {
            message: 'Ο αριθμός τηλεφώνου πρέπει να περιέχει μόνο ψηφία.'
          }),
        indicators: z.array(z.enum(['Viber', 'WhatsApp', 'Telegram'])).optional(),
    })).optional(),
});


export const socialsSchema = z.object({
    socials: z.array(z.object({
        type: z.string().default('Website'),
        label: z.enum(['Επαγγελματικό', 'Προσωπικό']).default('Επαγγελματικό'),
        url: z.string().url({ message: 'Μη έγκυρο URL.' }).or(z.literal('')),
    })).optional(),
});

export const addressSchema = z.object({
    addresses: z.array(z.object({
        type: z.string().default('Κύρια'),
        street: z.string().optional(),
        number: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(), // Νομός / Περιοχή
        postalCode: z.string().optional().refine(val => !val || /^\d{5}$/.test(val), {
            message: 'Ο Τ.Κ. πρέπει να αποτελείται από 5 ψηφία.'
        }),
        municipality: z.string().optional(),
        country: z.string().optional().default('Ελλάδα'),
    })).optional(),
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

export type ContactFormValues = z.infer<typeof contactSchema];

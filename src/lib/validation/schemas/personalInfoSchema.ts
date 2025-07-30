
import { z } from 'zod';

const personSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
});

export const personalInfoSchema = z.object({
  id: z.string().optional(), // Keep ID for editing context
  name: z.string().optional(),
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
  
  photoUrls: z.object({
    individual: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    legal: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    public: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
  }).optional(),
  
  // For legal entities
  representatives: z.array(personSchema).optional(),
});

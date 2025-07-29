
import { z } from 'zod';

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

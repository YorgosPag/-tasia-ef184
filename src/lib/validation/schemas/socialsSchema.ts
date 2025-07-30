
import { z } from 'zod';

export const socialsSchema = z.object({
    socials: z.array(z.object({
        type: z.string().default('Website'),
        label: z.enum(['Επαγγελματικό', 'Προσωπικό']).default('Επαγγελματικό'),
        url: z.string().url({ message: 'Μη έγκυρο URL.' }).or(z.literal('')),
    })).optional(),
});

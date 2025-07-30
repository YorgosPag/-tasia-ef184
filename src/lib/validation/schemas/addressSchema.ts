
import { z } from 'zod';

export const addressSchema = z.object({
    addresses: z.array(z.object({
        type: z.string().optional(),
        customTitle: z.string().optional(),
        street: z.string().optional(),
        number: z.string().optional(),
        toponym: z.string().optional(),
        poBox: z.string().optional(),
        postalCode: z.string().optional().refine(val => !val || /^\d{5}$/.test(val), {
            message: 'Ο Τ.Κ. πρέπει να αποτελείται από 5 ψηφία.'
        }),
        settlements: z.string().optional(),
        municipalLocalCommunities: z.string().optional(),
        municipalUnities: z.string().optional(),
        municipality: z.string().optional(),
        regionalUnities: z.string().optional(),
        regions: z.string().optional(),
        decentralizedAdministrations: z.string().optional(),
        largeGeographicUnits: z.string().optional(),
        country: z.string().optional().default('Ελλάδα'),
        fromGEMI: z.boolean().optional(),
        originNote: z.string().optional(),
        isActive: z.boolean().optional().default(true),
    })).optional(),
});

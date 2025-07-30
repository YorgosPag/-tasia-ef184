import { z } from "zod";
import type { Unit } from '@/hooks/use-unit-details';

export const newUnitSchema = z.object({
  floorIds: z.array(z.string()).nonempty({ message: "Πρέπει να επιλέξετε τουλάχιστον έναν όροφο." }),
  identifier: z.string().min(1, { message: "Ο κωδικός είναι υποχρεωτικός. Δημιουργήστε τον αυτόματα." }),
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  type: z.string().min(1, { message: "Ο τύπος είναι υποχρεωτικός." }),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος', 'Προς Ενοικίαση']),
  
  netArea: z.string().optional(),
  grossArea: z.string().optional(),
  commonArea: z.string().optional(),
  semiOutdoorArea: z.string().optional(),
  architecturalProjectionsArea: z.string().optional(),
  balconiesArea: z.string().optional(),

  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  kitchenLayout: z.string().optional(),
  description: z.string().optional(),
  isPenthouse: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  levelSpan: z.number().int().min(0).default(0),
});

export type NewUnitFormValues = z.infer<typeof newUnitSchema>;

export const MULTI_FLOOR_TYPES = ['Μεζονέτα', 'Κατάστημα'];

export const AMENITIES_LIST = [
    { id: 'parking', label: 'Θέση Στάθμευσης' },
    { id: 'elevator', label: 'Ασανσέρ' },
    { id: 'securityDoor', label: 'Πόρτα Ασφαλείας' },
    { id: 'alarm', label: 'Συναγερμός' },
    { id: 'furnished', label: 'Επιπλωμένο' },
    { id: 'storage', label: 'Αποθήκη' },
    { id: 'fireplace', label: 'Τζάκι' },
    { id: 'balcony', label: 'Βεράντα/Μπαλκόνι' },
    { id: 'internalStairs', label: 'Εσωτερική Σκάλα' },
    { id: 'garden', label: 'Κήπος' },
    { id: 'pool', label: 'Πισίνα' },
    { id: 'playroom', label: 'Playroom' },
];

export const ORIENTATIONS = [
    'Ανατολικός', 'Δυτικός', 'Βόρειος', 'Νότιος',
    'Βορειοανατολικός', 'Βορειοδυτικός', 'Νοτιοανατολικός', 'Νοτιοδυτικός',
    'Διαμπερές'
];

export const KITCHEN_LAYOUTS = [
    'Σαλοκουζίνα (Ενιαίος χώρος)', 'Ξεχωριστή Κουζίνα', 'Χωρίς Κουζίνα/Σαλόνι'
];

export function getUnitDataFromForm(data: NewUnitFormValues) {
    const unitData: { [key: string]: any } = {
        identifier: data.identifier,
        name: data.name,
        type: data.type || '',
        status: data.status,
        floorIds: data.floorIds,
        netArea: data.netArea ? parseFloat(data.netArea) : undefined,
        grossArea: data.grossArea ? parseFloat(data.grossArea) : undefined,
        commonArea: data.commonArea ? parseFloat(data.commonArea) : undefined,
        semiOutdoorArea: data.semiOutdoorArea ? parseFloat(data.semiOutdoorArea) : undefined,
        architecturalProjectionsArea: data.architecturalProjectionsArea ? parseFloat(data.architecturalProjectionsArea) : undefined,
        balconiesArea: data.balconiesArea ? parseFloat(data.balconiesArea) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : undefined,
        bathrooms: data.bathrooms,
        orientation: data.orientation || '',
        kitchenLayout: data.kitchenLayout || '',
        description: data.description || '',
        isPenthouse: data.isPenthouse,
        amenities: data.amenities || [],
        levelSpan: data.levelSpan,
    };

    // Remove undefined keys before sending to Firestore
    Object.keys(unitData).forEach(key => (unitData[key] === undefined || unitData[key] === '') && delete unitData[key]);
    
    // Ensure boolean false is kept
    if (data.isPenthouse === false) {
        unitData.isPenthouse = false;
    }

    return unitData;
}

export function getAttachmentDataFromForm(data: any) {
    const attachmentData: { [key: string]: any } = {
        identifier: data.identifier,
        type: data.type,
        details: data.details,
        area: data.area ? parseFloat(data.area) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        sharePercentage: data.sharePercentage ? parseFloat(data.sharePercentage) : undefined,
        isBundle: data.isBundle,
        isStandalone: data.isStandalone,
        photoUrl: data.photoUrl?.trim() || undefined,
    };
    
    // Remove undefined keys before sending to Firestore
    Object.keys(attachmentData).forEach(key => (attachmentData[key] === undefined || attachmentData[key] === '') && delete attachmentData[key]);
    
    // Ensure boolean false is kept
    if (data.isBundle === false) attachmentData.isBundle = false;
    if (data.isStandalone === false) attachmentData.isStandalone = false;
    
    return attachmentData;
}

export const getStatusClass = (status: NewUnitFormValues['status'] | undefined) => {
    switch (status) {
        case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600 text-white';
        case 'Κρατημένο': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
        case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'Προς Ενοικίαση': return 'bg-purple-500 hover:bg-purple-600 text-white';
        case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600 text-white';
        default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
}

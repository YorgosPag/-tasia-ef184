
import { UnitFormValues } from "@/components/units/UnitDetailsForm";
import { AttachmentFormValues } from "@/components/units/AttachmentDialog";

export const AMENITIES_LIST = [
    { id: 'parking', label: 'Θέση Στάθμευσης' },
    { id: 'elevator', label: 'Ασανσέρ' },
    { id: 'securityDoor', label: 'Πόρτα Ασφαλείας' },
    { id: 'alarm', label: 'Συναγερμός' },
    { id: 'furnished', label: 'Επιπλωμένο' },
    { id: 'storage', label: 'Αποθήκη' },
    { id: 'fireplace', label: 'Τζάκι' },
    { id: 'balcony', label: 'Βεράντα' },
    { id: 'internalStairs', label: 'Εσωτερική Σκάλα' },
    { id: 'garden', label: 'Κήπος' },
    { id: 'pool', label: 'Πισίνα' },
    { id: 'playroom', label: 'Playroom' },
];

export function getUnitDataFromForm(data: UnitFormValues) {
    const unitData: { [key: string]: any } = {
        identifier: data.identifier,
        name: data.name,
        type: data.type || '',
        status: data.status,
        area: data.area ? parseFloat(data.area) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : undefined,
        orientation: data.orientation || '',
        description: data.description || '',
        isPenthouse: data.isPenthouse,
        amenities: data.amenities || [],
        levelSpan: data.levelSpan > 1 ? `${data.levelSpan}F` : undefined,
    };

    // Remove undefined keys before sending to Firestore
    Object.keys(unitData).forEach(key => (unitData[key] === undefined || unitData[key] === '') && delete unitData[key]);
    
    // Ensure boolean false is kept
    if (data.isPenthouse === false) {
        unitData.isPenthouse = false;
    }


    return unitData;
}

export function getAttachmentDataFromForm(data: AttachmentFormValues) {
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

export const getStatusClass = (status: UnitFormValues['status'] | undefined) => {
    switch (status) {
        case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600 text-white';
        case 'Κρατημένο': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
        case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600 text-white';
        default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
}

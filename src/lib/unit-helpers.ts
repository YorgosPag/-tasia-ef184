import { UnitFormValues } from "@/components/units/UnitDetailsForm";
import { AttachmentFormValues } from "@/components/units/AttachmentDialog";

export function getUnitDataFromForm(data: UnitFormValues) {
    return {
        identifier: data.identifier,
        name: data.name,
        type: data.type || '',
        status: data.status,
        area: data.area ? parseFloat(data.area) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : undefined,
        orientation: data.orientation || '',
        amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
    };
}

export function getAttachmentDataFromForm(data: AttachmentFormValues) {
    return {
        type: data.type,
        details: data.details,
        area: data.area ? parseFloat(data.area) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        sharePercentage: data.sharePercentage ? parseFloat(data.sharePercentage) : undefined,
        isBundle: data.isBundle,
        isStandalone: data.isStandalone,
        photoUrl: data.photoUrl?.trim() || undefined,
    };
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


export interface AttachmentFormValues {
    id?: string;
    unitId?: string;
    type: 'parking' | 'storage';
    identifier?: string;
    details?: string;
    area?: string;
    price?: string;
    sharePercentage?: string;
    isBundle: boolean;
    isStandalone: boolean;
}

export interface Attachment extends AttachmentFormValues {
    id: string;
}

export interface Unit {
    id: string;
    name: string;
    identifier: string;
}

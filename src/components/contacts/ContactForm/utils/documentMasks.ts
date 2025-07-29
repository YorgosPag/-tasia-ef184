
'use client';
import { useMemo } from 'react';
import { getValidationRule } from '@/shared/lib/validation/schemas/utils/documentValidation';

/**
 * A custom hook to provide masking and placeholder logic for document numbers.
 * @param {string | undefined} type - The selected document type.
 * @returns An object with the placeholder text and a function to format the input value.
 */
export function useDocumentNumberMask(type?: string) {
    const rule = useMemo(() => getValidationRule(type), [type]);

    return {
        placeholder: rule.placeholder,
        formatValue: rule.format
    };
}

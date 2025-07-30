
'use client';

import { useMemo } from 'react';
import { getValidationRule } from '@/shared/lib/validation/schemas/utils/documentValidation';

/**
 * A hook to get the correct placeholder, pattern, and formatting function
 * for a given identity document type.
 * @param {string | undefined} type - The type of the document.
 * @returns An object with the placeholder, pattern, and format function.
 */
export function useDocumentNumberMask(type?: string) {
  const rule = useMemo(() => getValidationRule(type), [type]);

  return {
    placeholder: rule.placeholder,
    pattern: rule.pattern,
    formatValue: rule.format,
  };
}

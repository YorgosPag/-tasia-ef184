'use client';

import { useState, useEffect } from 'react';
import { StorageUnit } from '@/lib/types/storage';

export function useFormValidation() {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (formData: Partial<StorageUnit>) => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.code?.trim()) {
      newErrors.code = 'Ο κωδικός είναι υποχρεωτικός';
    }
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'Η επιφάνεια πρέπει να είναι μεγαλύτερη από 0';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Η τιμή πρέπει να είναι μεγαλύτερη από 0';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Η περιγραφή είναι υποχρεωτική';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateForm };
}

export function usePriceCalculation(
  formData: Partial<StorageUnit>,
  setFormData: React.Dispatch<React.SetStateAction<Partial<StorageUnit>>>,
  isEditing: boolean
) {
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  useEffect(() => {
    if (formData.area && formData.area > 0 && !isEditing) {
      setIsCalculatingPrice(true);
      
      const timeout = setTimeout(() => {
        const basePricePerSqm = formData.type === 'storage' ? 400 : 200;
        const floorMultiplier = formData.floor === 'Υπόγειο' ? 1.0 : 
                              formData.floor === 'Ισόγειο' ? 1.2 : 1.1;
        
        const calculatedPrice = Math.round(formData.area * basePricePerSqm * floorMultiplier);
        
        setFormData(prev => ({ ...prev, price: calculatedPrice }));
        setIsCalculatingPrice(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [formData.area, formData.type, formData.floor, isEditing, setFormData]);

  return { isCalculatingPrice };
}

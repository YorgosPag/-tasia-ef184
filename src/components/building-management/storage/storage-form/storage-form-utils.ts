'use client';

import { StorageType } from '@/types/storage';

export const availableFloors = [
  'Υπόγειο 2',
  'Υπόγειο 1', 
  'Υπόγειο',
  'Ισόγειο',
  '1ος Όροφος',
  '2ος Όροφος',
  '3ος Όροφος',
  '4ος Όροφος',
  '5ος Όροφος',
  '6ος Όροφος',
  '7ος Όροφος'
];

export const commonFeatures: Record<StorageType, string[]> = {
  storage: [
    'Ηλεκτρικό ρεύμα',
    'Φυσικός φωτισμός',
    'Τεχνητός φωτισμός',
    'Αεροθαλάμος',
    'Ασφάλεια',
    'Πρόσβαση ανελκυστήρα',
    'Υδραυλικές εγκαταστάσεις'
  ],
  parking: [
    'Καλυμμένη θέση',
    'Ανοιχτή θέση',
    'Πρίζα φόρτισης',
    'Ηλεκτρικό ρεύμα',
    'Φωτισμός',
    'Ασφάλεια',
    'Εύκολη πρόσβαση',
    'Θέση για μεγάλο όχημα'
  ]
};

export const generateAutoCode = (type?: StorageType, floor?: string) => {
  const typePrefix = type === 'storage' ? 'A' : 'P';
  const floorPrefix = floor === 'Υπόγειο' ? 'B' : 
                     floor === 'Ισόγειο' ? 'G' : 'F';
  const randomNum = Math.floor(Math.random() * 99) + 1;
  
  return `${typePrefix}_${floorPrefix}${randomNum.toString().padStart(2, '0')}`;
};

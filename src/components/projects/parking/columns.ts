'use client';
import type { ParkingSpot } from './types';

const formatNumber = (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return '';
    return num.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const columns: Array<{ 
    key: string; 
    label: string; 
    format?: (value: any) => string; 
    defaultWidth?: number 
}> = [
  { key: 'code', label: 'Κωδικός', defaultWidth: 8 },
  { key: 'type', label: 'Τύπος', defaultWidth: 8 },
  { key: 'property', label: 'Ακίνητο', defaultWidth: 8 },
  { key: 'level', label: 'Επίπεδο', defaultWidth: 8 },
  { key: 'tm', label: 'Τ.Μ.', format: formatNumber, defaultWidth: 8 },
  { key: 'price', label: 'Τιμή', format: formatNumber, defaultWidth: 8 },
  { key: 'value', label: 'Αντ. Αξία', format: formatNumber, defaultWidth: 8 },
  { key: 'valueWithVat', label: 'Αντ. Αξία Με Συνιδιοκτησία', format: formatNumber, defaultWidth: 15 },
  { key: 'status', label: 'Κατάσταση', defaultWidth: 8 },
  { key: 'owner', label: 'Ιδιοκτήτης', defaultWidth: 10 },
  { key: 'holder', label: 'Κάτοψη', defaultWidth: 10 },
  { key: 'registeredBy', label: 'Καταχωρήθηκε Από', defaultWidth: 10 }
];

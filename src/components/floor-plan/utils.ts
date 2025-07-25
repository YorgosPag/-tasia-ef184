
'use client';

import { Unit } from './Unit';

export const ALL_STATUSES: Unit['status'][] = [
  'Διαθέσιμο',
  'Προς Ενοικίαση',
  'Κρατημένο',
  'Πωλημένο',
  'Οικοπεδούχος',
];

export const STATUS_COLOR_MAP: Record<Unit['status'], string> = {
  'Πωλημένο': '#ef4444', // red-500
  'Κρατημένο': '#eab308', // yellow-500
  'Διαθέσιμο': '#22c55e', // green-500
  'Προς Ενοικίαση': '#8b5cf6', // purple-500
  'Οικοπεδούχος': '#f97316', // orange-500
};


/**
 * Determines text color based on background luminance.
 * @param hexColor The background color in hex format (e.g., "#RRGGBB").
 * @returns 'text-black' for light backgrounds, 'white' for dark backgrounds.
 */
export function getTextColorForBackground(hexColor: string): 'text-black' | 'text-white' {
    if (!hexColor.startsWith('#')) {
      // Handle non-hex colors like hsl(var(--...)) by assuming a dark background.
      // This is a safe fallback for the default theme colors. A more robust solution
      // would parse HSL values, but this is sufficient for now.
      if(hexColor.includes('hsl')) return 'text-white';
      return 'text-white';
    }

    try {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);

        // Formula to determine luminance (YIQ equation)
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        
        return (yiq >= 128) ? 'text-black' : 'text-white';
    } catch (e) {
        console.error("Could not parse hex color", hexColor, e);
        return 'text-white'; // Fallback for safety
    }
}

export const getStatusClass = (status: Unit['status'] | undefined) => {
    switch (status) {
        case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600 text-white';
        case 'Κρατημένο': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
        case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'Προς Ενοικίαση': return 'bg-purple-500 hover:bg-purple-600 text-white';
        case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600 text-white';
        default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
}

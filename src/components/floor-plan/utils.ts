
import { Unit } from './FloorPlanViewer';

export const ALL_STATUSES: Unit['status'][] = [
  'Διαθέσιμο',
  'Κρατημένο',
  'Πωλημένο',
  'Οικοπεδούχος',
];

export const STATUS_COLOR_MAP: Record<Unit['status'], string> = {
  'Πωλημένο': 'hsl(0 84.2% 60.2%)', // Destructive
  'Κρατημένο': 'hsl(217.2 91.2% 59.8%)', // Primary
  'Διαθέσιμο': '#22c55e', // green-500
  'Οικοπεδούχος': '#f97316', // orange-500
};


/**
 * Determines text color based on background luminance.
 * @param hexColor The background color in hex format (e.g., "#RRGGBB").
 * @returns 'black' for light backgrounds, 'white' for dark backgrounds.
 */
function getTextColorForBackground(hexColor: string): 'black' | 'white' {
    if (!hexColor.startsWith('#')) return 'white';

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Formula to determine luminance (YIQ equation)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    return (yiq >= 128) ? 'black' : 'white';
}


/**
 * Gets the appropriate text color class for a given status badge.
 * This is now simplified as the background is handled by inline styles.
 * We just need to determine if the text should be light or dark.
 */
export const getStatusClass = (status: Unit['status'] | undefined) => {
  // This function is now simpler. The background color will be applied via inline style.
  // We can add logic here to determine if text should be black or white based on the
  // selected color's luminance, but for now, white is a safe default for most custom colors.
  return 'text-white';
};

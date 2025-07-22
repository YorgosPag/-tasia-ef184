
import { Unit } from './FloorPlanViewer';

export const ALL_STATUSES: Unit['status'][] = [
  'Διαθέσιμο',
  'Κρατημένο',
  'Πωλημένο',
  'Οικοπεδούχος',
];

export const getStatusClass = (status: Unit['status'] | undefined, type: 'bg' | 'color' = 'bg') => {
  switch (status) {
    case 'Πωλημένο':
      return type === 'bg' ? 'bg-destructive text-destructive-foreground' : 'destructive';
    case 'Κρατημένο':
      return type === 'bg' ? 'bg-primary text-primary-foreground' : 'primary';
    case 'Διαθέσιμο':
      return type === 'bg' ? 'bg-green-500 hover:bg-green-600 text-white' : 'green-500'; // Special case, no HSL var
    case 'Οικοπεδούχος':
      return type === 'bg' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'orange-500'; // Special case, no HSL var
    default:
      return type === 'bg' ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'gray-500'; // Special case, no HSL var
  }
};


import { Unit } from './FloorPlanViewer';

export const ALL_STATUSES: Unit['status'][] = [
  'Διαθέσιμο',
  'Κρατημένο',
  'Πωλημένο',
  'Οικοπεδούχος',
];

export const getStatusColor = (status?: Unit['status']) => {
  switch (status) {
    case 'Πωλημένο':
      return 'hsl(var(--destructive))';
    case 'Κρατημένο':
      return 'hsl(var(--primary))';
    case 'Διαθέσιμο':
      return '#22c55e'; // green-500
    case 'Οικοπεδούχος':
      return '#f97316'; // orange-500
    default:
      return '#6b7280'; // gray-500
  }
};

export const getStatusClass = (status: Unit['status'] | undefined) => {
  switch (status) {
    case 'Πωλημένο':
      return 'bg-destructive text-destructive-foreground';
    case 'Κρατημένο':
      return 'bg-primary text-primary-foreground';
    case 'Διαθέσιμο':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'Οικοπεδούχος':
      return 'bg-orange-500 hover:bg-orange-600 text-white';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

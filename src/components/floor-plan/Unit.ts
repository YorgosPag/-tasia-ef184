
export interface Unit {
  id: string;
  identifier: string;
  name: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος' | 'Προς Ενοικίαση';
  polygonPoints?: { x: number; y: number }[];
}

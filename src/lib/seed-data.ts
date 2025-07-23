
import { Timestamp } from 'firebase/firestore';

type UnitStatus = 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';

export const companiesData: any[] = [];

export const projectsData: any[] = [];

export const buildingsData: any[] = [];

export const floorsData: any[] = [];

export const unitsData: {
  _id: string; floorIds: string[]; levelSpan?: string; identifier: string; name: string; type: string; status: UnitStatus;
  area: number; price?: number; bedrooms?: number; bathrooms?: number; orientation?: string; amenities?: string[];
  polygonPoints?: { x: number; y: number }[];
  attachments: { type: 'parking' | 'storage'; details: string; area?: number; price?: number; photoUrl?: string, sharePercentage?: number, isBundle?: boolean, isStandalone?: boolean }[];
}[] = [];

"use client";

export interface PropertyDetails {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: number;
  project: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  price?: number;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  description?: string;
  features: string[];
  owner?: {
    name: string;
    phone?: string;
    email?: string;
  };
  agent?: {
    name: string;
    phone?: string;
    email?: string;
  };
  dates: {
    created: string;
    updated: string;
    available?: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

export interface StatusConfig {
  label: string;
  color: string;
}
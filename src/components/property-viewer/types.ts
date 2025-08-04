"use client";

export interface PropertyPolygon {
  id: string;
  name: string;
  type: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  vertices: Array<{ x: number; y: number }>;
  color: string;
  price?: number;
  area?: number;
}

export interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: PropertyPolygon[];
}

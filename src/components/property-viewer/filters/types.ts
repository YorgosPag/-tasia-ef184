"use client";

export interface FilterState {
  project: string[];
  building: string[];
  floor: string[];
  propertyType: string[];
  status: string[];
}

export interface ActiveFilter {
    type: keyof FilterState;
    value: string;
}

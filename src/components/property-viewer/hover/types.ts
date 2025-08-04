"use client";

export interface PropertyHoverData {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: number;
  status: "for-sale" | "for-rent" | "sold" | "rented" | "reserved";
  price?: number;
  area?: number;
  quickInfo?: string;
}

export interface StatusConfig {
  label: string;
  color: string;
  priceLabel: string;
}

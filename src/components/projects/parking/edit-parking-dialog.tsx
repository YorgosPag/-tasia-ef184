'use client';
import React from 'react';
import { ParkingSpot } from './types';

export function EditParkingDialog({ trigger, parkingSpot }: { trigger: React.ReactNode, parkingSpot: ParkingSpot | null }) {
  // In a real implementation, this would be a Dialog component
  // For now, it just renders the trigger button.
  return <>{trigger}</>;
}

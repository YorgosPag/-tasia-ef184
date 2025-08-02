'use client';
import React from 'react';

export function AddParkingDialog({ trigger }: { trigger: React.ReactNode }) {
  // In a real implementation, this would be a Dialog component
  // For now, it just renders the trigger button.
  return <>{trigger}</>;
}

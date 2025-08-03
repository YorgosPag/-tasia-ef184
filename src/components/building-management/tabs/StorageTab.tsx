'use client';

import React from 'react';
import { StorageTab as StorageTabContent } from '../storage/storage-tab';
import type { Building } from '@/types/building';


interface StorageTabProps {
  building: Building;
}


export function StorageTab({ building }: StorageTabProps) {
  return <StorageTabContent building={building} />;
}

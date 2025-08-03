'use client';

import React, { useState } from 'react';
import { LayoutControls } from './LayoutControls';
import { LayoutPreview } from './LayoutPreview';

export interface LayoutSettings {
  padding: number;
  margin: number;
  borderRadius: number;
  borderWidth: number;
  shadow: number;
}

export function LayoutCustomizer() {
  const [settings, setSettings] = useState<LayoutSettings>({
    padding: 24,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadow: 10,
  });

  const updateSetting = (key: keyof LayoutSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1">
        <LayoutControls settings={settings} updateSetting={updateSetting} />
      </div>
      <div className="xl:col-span-2">
        <LayoutPreview settings={settings} />
      </div>
    </div>
  );
}

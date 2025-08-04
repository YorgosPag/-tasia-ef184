'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar, Monitor } from 'lucide-react';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { hexToHslString, hslStringToHex } from './utils';

const PRESET_COLORS = [
    '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#6366F1', '#8B5CF6'
];

export function AppLayoutCustomizer() {
  const [sidebarBg, setSidebarBg] = useLocalStorageState('--sidebar-background-hsl', '220 60% 98%');
  const [headerBg, setHeaderBg] = useLocalStorageState('--header-background-hsl', '220 60% 98%');
  const [sidebarWidth, setSidebarWidth] = useLocalStorageState('--sidebar-width', '256px');
  const [sidebarCollapsedWidth, setSidebarCollapsedWidth] = useLocalStorageState('--sidebar-width-icon', '52px');
  const [headerHeight, setHeaderHeight] = useLocalStorageState('--header-height', '64px');
  
  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-background-hsl', sidebarBg);
  }, [sidebarBg]);
  
  React.useEffect(() => {
    document.documentElement.style.setProperty('--header-background-hsl', headerBg);
  }, [headerBg]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
  }, [sidebarWidth]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width-icon', sidebarCollapsedWidth);
  }, [sidebarCollapsedWidth]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--header-height', headerHeight);
  }, [headerHeight]);

  const DimensionControl = ({ label, value, onValueChange }: { label: string, value: string, onValueChange: (val: string) => void }) => {
    const numericValue = parseInt(value, 10);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
                <Label>{label}</Label>
                <div className="relative w-24">
                    <Input
                        type="number"
                        value={numericValue}
                        onChange={(e) => onValueChange(`${e.target.value}px`)}
                        className="h-8 text-sm pr-7"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
                </div>
            </div>
            <Slider
                value={[numericValue]}
                onValueChange={([val]) => onValueChange(`${val}px`)}
                min={40} max={400} step={2}
            />
        </div>
    );
  };

  const ColorInputWithPresets = ({ label, id, value, onChange }: { label: string, id: string, value: string, onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          id={id}
          value={hslStringToHex(value)}
          onChange={(e) => onChange(hexToHslString(e.target.value))}
          className="w-12 h-10 p-1"
        />
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="h-10"
        />
      </div>
      <div className="flex flex-wrap gap-1 pt-1">
        {PRESET_COLORS.map(preset => (
          <button
            key={`${id}-${preset}`}
            className="w-5 h-5 rounded-full border border-border/50 transition-transform hover:scale-110"
            style={{ backgroundColor: preset }}
            onClick={() => onChange(hexToHslString(preset))}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Sidebar Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sidebar className="w-5 h-5" />
            Ρυθμίσεις Sidebar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ColorInputWithPresets label="Χρώμα Φόντου Sidebar" id="sidebar-bg" value={sidebarBg} onChange={setSidebarBg} />
          <DimensionControl label="Πλάτος Sidebar (Expanded)" value={sidebarWidth} onValueChange={setSidebarWidth} />
          <DimensionControl label="Πλάτος Sidebar (Collapsed)" value={sidebarCollapsedWidth} onValueChange={setSidebarCollapsedWidth} />
        </CardContent>
      </Card>
      
      {/* Header Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Ρυθμίσεις Header
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ColorInputWithPresets label="Χρώμα Φόντου Header" id="header-bg" value={headerBg} onChange={setHeaderBg} />
          <DimensionControl label="Ύψος Header" value={headerHeight} onValueChange={setHeaderHeight} />
        </CardContent>
      </Card>
    </div>
  );
}

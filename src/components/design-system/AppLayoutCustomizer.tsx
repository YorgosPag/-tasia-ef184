'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar, Monitor } from 'lucide-react';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

const PRESET_COLORS = [
    '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#6366F1', '#8B5CF6'
];

export function AppLayoutCustomizer() {
  const [sidebarBg, setSidebarBg] = useLocalStorageState('--sidebar-background-hsl', '220 60% 98%');
  const [headerBg, setHeaderBg] = useLocalStorageState('--header-background-hsl', '220 60% 98%');
  const [sidebarWidth, setSidebarWidth] = useLocalStorageState('--sidebar-width-px', 256);
  const [sidebarCollapsedWidth, setSidebarCollapsedWidth] = useLocalStorageState('--sidebar-width-icon-px', 52);
  const [headerHeight, setHeaderHeight] = useLocalStorageState('--header-height-px', 64);
  
  // Helper to convert hex to HSL string
  const hexToHslString = (hex: string): string => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
  };

  // Helper to convert HSL string to hex
  const hslStringToHex = (hsl: string): string => {
    const [h, s, l] = hsl.replace(/%/g, '').split(' ').map(Number);
    const s_norm = s / 100;
    const l_norm = l / 100;
    const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l_norm - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r,g,b] = [c,x,0] }
    else if (h >= 60 && h < 120) { [r,g,b] = [x,c,0] }
    else if (h >= 120 && h < 180) { [r,g,b] = [0,c,x] }
    else if (h >= 180 && h < 240) { [r,g,b] = [0,x,c] }
    else if (h >= 240 && h < 300) { [r,g,b] = [x,0,c] }
    else if (h >= 300 && h < 360) { [r,g,b] = [c,0,x] }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-background', sidebarBg);
  }, [sidebarBg]);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--header-background', headerBg);
  }, [headerBg]);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [sidebarWidth]);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width-icon', `${sidebarCollapsedWidth}px`);
  }, [sidebarCollapsedWidth]);

  useEffect(() => {
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }, [headerHeight]);

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
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Πλάτος Sidebar (Expanded)</Label>
               <div className="relative w-24">
                  <Input
                      type="number"
                      value={sidebarWidth}
                      onChange={(e) => setSidebarWidth(parseInt(e.target.value, 10) || 0)}
                      min={200}
                      max={400}
                      className="h-8 text-sm pr-7"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
              </div>
            </div>
            <Slider value={[sidebarWidth]} onValueChange={([val]) => setSidebarWidth(val)} min={200} max={400} step={4} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Πλάτος Sidebar (Collapsed)</Label>
               <div className="relative w-24">
                  <Input
                      type="number"
                      value={sidebarCollapsedWidth}
                      onChange={(e) => setSidebarCollapsedWidth(parseInt(e.target.value, 10) || 0)}
                      min={40}
                      max={80}
                      className="h-8 text-sm pr-7"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
              </div>
            </div>
            <Slider value={[sidebarCollapsedWidth]} onValueChange={([val]) => setSidebarCollapsedWidth(val)} min={40} max={80} step={1} />
          </div>
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
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Ύψος Header</Label>
               <div className="relative w-24">
                  <Input
                      type="number"
                      value={headerHeight}
                      onChange={(e) => setHeaderHeight(parseInt(e.target.value, 10) || 0)}
                      min={48}
                      max={96}
                      className="h-8 text-sm pr-7"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
              </div>
            </div>
            <Slider value={[headerHeight]} onValueChange={([val]) => setHeaderHeight(val)} min={48} max={96} step={2} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

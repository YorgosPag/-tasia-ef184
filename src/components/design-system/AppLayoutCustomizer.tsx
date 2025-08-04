'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar, Monitor } from 'lucide-react';

const PRESET_COLORS = [
    '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#6366F1', '#8B5CF6'
];

export function AppLayoutCustomizer() {
  const [sidebarBg, setSidebarBg] = useState<string>('');
  const [headerBg, setHeaderBg] = useState<string>('');
  const [sidebarWidth, setSidebarWidth] = useState<number>(256); // 16rem = 256px
  const [sidebarCollapsedWidth, setSidebarCollapsedWidth] = useState<number>(52); // 3.25rem = 52px
  const [headerHeight, setHeaderHeight] = useState<number>(64); // h-16 = 64px

  useEffect(() => {
    // Get initial values from CSS variables
    const rootStyle = getComputedStyle(document.documentElement);
    setSidebarBg(rootStyle.getPropertyValue('--sidebar-background').trim());
    setHeaderBg(rootStyle.getPropertyValue('--header-background')?.trim() || rootStyle.getPropertyValue('--sidebar-background').trim());
  }, []);

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
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
                    onClick={() => onChange(preset)}
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

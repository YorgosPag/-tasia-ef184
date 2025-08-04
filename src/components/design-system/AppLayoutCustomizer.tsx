'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar, PanelTop } from 'lucide-react';

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
          <div className="space-y-2">
            <Label htmlFor="sidebar-bg">Χρώμα Φόντου Sidebar</Label>
            <div className="flex items-center gap-2">
                <Input
                    type="color"
                    id="sidebar-bg"
                    value={sidebarBg}
                    onChange={(e) => setSidebarBg(e.target.value)}
                    className="w-12 h-10 p-1"
                />
                <Input 
                    value={sidebarBg} 
                    onChange={(e) => setSidebarBg(e.target.value)} 
                    className="h-10"
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Πλάτος Sidebar (Expanded)</Label>
            <Slider value={[sidebarWidth]} onValueChange={([val]) => setSidebarWidth(val)} min={200} max={400} step={4} />
            <div className="text-right text-sm text-muted-foreground">{sidebarWidth}px</div>
          </div>
          <div className="space-y-2">
            <Label>Πλάτος Sidebar (Collapsed)</Label>
            <Slider value={[sidebarCollapsedWidth]} onValueChange={([val]) => setSidebarCollapsedWidth(val)} min={40} max={80} step={1} />
             <div className="text-right text-sm text-muted-foreground">{sidebarCollapsedWidth}px</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Header Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PanelTop className="w-5 h-5" />
            Ρυθμίσεις Header
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="header-bg">Χρώμα Φόντου Header</Label>
            <div className="flex items-center gap-2">
                <Input
                    type="color"
                    id="header-bg"
                    value={headerBg}
                    onChange={(e) => setHeaderBg(e.target.value)}
                    className="w-12 h-10 p-1"
                />
                <Input 
                    value={headerBg} 
                    onChange={(e) => setHeaderBg(e.target.value)} 
                    className="h-10"
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ύψος Header</Label>
            <Slider value={[headerHeight]} onValueChange={([val]) => setHeaderHeight(val)} min={48} max={96} step={2} />
             <div className="text-right text-sm text-muted-foreground">{headerHeight}px</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

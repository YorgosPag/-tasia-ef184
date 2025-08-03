'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Paintbrush, 
  RotateCcw, 
  Copy, 
  Check,
  Palette,
  Eye
} from 'lucide-react';

interface ColorConfig {
  name: string;
  displayName: string;
  value: string;
  category: 'primary' | 'status' | 'background' | 'text';
}

const defaultColors: ColorConfig[] = [
  // Primary Colors
  { name: 'primary', displayName: 'Primary', value: '#3B82F6', category: 'primary' },
  { name: 'secondary', displayName: 'Secondary', value: '#64748B', category: 'primary' },
  { name: 'accent', displayName: 'Accent', value: '#F1F5F9', category: 'primary' },
  { name: 'muted', displayName: 'Muted', value: '#F8FAFC', category: 'primary' },
  
  // Status Colors
  { name: 'success', displayName: 'Success', value: '#22C55E', category: 'status' },
  { name: 'warning', displayName: 'Warning', value: '#EAB308', category: 'status' },
  { name: 'error', displayName: 'Error', value: '#EF4444', category: 'status' },
  { name: 'info', displayName: 'Info', value: '#3B82F6', category: 'status' },
  
  // Background Colors
  { name: 'background', displayName: 'Background', value: '#FFFFFF', category: 'background' },
  { name: 'card', displayName: 'Card', value: '#FFFFFF', category: 'background' },
  { name: 'popover', displayName: 'Popover', value: '#FFFFFF', category: 'background' },
  { name: 'border', displayName: 'Border', value: '#E2E8F0', category: 'background' },
  
  // Text Colors
  { name: 'foreground', displayName: 'Text Primary', value: '#0F172A', category: 'text' },
  { name: 'muted-foreground', displayName: 'Text Muted', value: '#64748B', category: 'text' },
];

export function ColorCustomizer() {
  const [colors, setColors] = useState<ColorConfig[]>(defaultColors);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const updateColor = (name: string, newValue: string) => {
    setColors(prev => prev.map(color => 
      color.name === name ? { ...color, value: newValue } : color
    ));
    
    // Apply color to CSS custom properties
    document.documentElement.style.setProperty(`--${name}`, newValue);
  };

  const resetColors = () => {
    setColors(defaultColors);
    defaultColors.forEach(color => {
      document.documentElement.style.setProperty(`--${color.name}`, color.value);
    });
  };

  const copyColor = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedColor(value);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const exportColors = () => {
    const cssVariables = colors.map(color => `  --${color.name}: ${color.value};`).join('\n');
    const cssExport = `:root {\n${cssVariables}\n}`;
    
    const blob = new Blob([cssExport], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-theme.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryColors = (category: ColorConfig['category']) => {
    return colors.filter(color => color.category === category);
  };

  const CategorySection = ({ category, title }: { category: ColorConfig['category'], title: string }) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {getCategoryColors(category).map((color) => (
          <div key={color.name} className="space-y-2">
            <Label htmlFor={color.name} className="text-xs font-medium">
              {color.displayName}
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="color"
                  id={color.name}
                  value={color.value}
                  onChange={(e) => updateColor(color.name, e.target.value)}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
              </div>
              <Input
                type="text"
                value={color.value}
                onChange={(e) => updateColor(color.name, e.target.value)}
                className="flex-1 h-10 text-xs font-mono"
                placeholder="#000000"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => copyColor(color.value)}
              >
                {copiedColor === color.value ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Color Customization */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="w-5 h-5" />
                Color Palette Customizer
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={resetColors}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={exportColors}>
                  <Copy className="w-4 h-4 mr-2" />
                  Export CSS
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <CategorySection category="primary" title="Primary Colors" />
            <CategorySection category="status" title="Status Colors" />
            <CategorySection category="background" title="Background Colors" />
            <CategorySection category="text" title="Text Colors" />
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium mb-2">Buttons</h5>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="destructive" size="sm">Destructive</Button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Cards</h5>
                <Card className="p-3">
                  <h6 className="text-sm font-semibold mb-1">Sample Card</h6>
                  <p className="text-xs text-muted-foreground">
                    This card shows how your colors look in practice.
                  </p>
                </Card>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Badges</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Text Styles</h5>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Primary Text</p>
                  <p className="text-sm text-muted-foreground">Muted Text</p>
                  <p className="text-xs">Small Text</p>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Status Indicators</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Success Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">Warning Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs">Error Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Info Status</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {colors.slice(0, 8).map((color) => (
                <div key={color.name} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{color.displayName}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span className="font-mono text-muted-foreground">{color.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

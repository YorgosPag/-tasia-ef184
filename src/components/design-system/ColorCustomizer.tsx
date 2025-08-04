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
  { name: 'primary', displayName: 'Κύριο', value: '#3B82F6', category: 'primary' },
  { name: 'secondary', displayName: 'Δευτερεύον', value: '#64748B', category: 'primary' },
  { name: 'accent', displayName: 'Τονισμός', value: '#F1F5F9', category: 'primary' },
  { name: 'muted', displayName: 'Σίγαση', value: '#F8FAFC', category: 'primary' },
  
  // Status Colors
  { name: 'success', displayName: 'Επιτυχία', value: '#22C55E', category: 'status' },
  { name: 'warning', displayName: 'Προειδοποίηση', value: '#EAB308', category: 'status' },
  { name: 'error', displayName: 'Σφάλμα', value: '#EF4444', category: 'status' },
  { name: 'info', displayName: 'Πληροφορία', value: '#3B82F6', category: 'status' },
  
  // Background Colors
  { name: 'background', displayName: 'Φόντο', value: '#FFFFFF', category: 'background' },
  { name: 'card', displayName: 'Κάρτα', value: '#FFFFFF', category: 'background' },
  { name: 'popover', displayName: 'Αναδυόμενο', value: '#FFFFFF', category: 'background' },
  { name: 'border', displayName: 'Περίγραμμα', value: '#E2E8F0', category: 'background' },
  
  // Text Colors
  { name: 'foreground', displayName: 'Κύριο Κείμενο', value: '#0F172A', category: 'text' },
  { name: 'muted-foreground', displayName: 'Δευτερεύον Κείμενο', value: '#64748B', category: 'text' },
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
                  className="w-12 h-9 p-1 border rounded cursor-pointer"
                />
              </div>
              <Input
                type="text"
                value={color.value}
                onChange={(e) => updateColor(color.name, e.target.value)}
                className="flex-1 h-9 text-xs font-mono"
                placeholder="#000000"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
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
                Παραμετροποίηση Παλέτας
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={resetColors}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Επαναφορά
                </Button>
                <Button variant="outline" size="sm" onClick={exportColors}>
                  <Copy className="w-4 h-4 mr-2" />
                  Εξαγωγή CSS
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <CategorySection category="primary" title="Κύρια Χρώματα" />
            <CategorySection category="status" title="Χρώματα Κατάστασης" />
            <CategorySection category="background" title="Χρώματα Φόντου" />
            <CategorySection category="text" title="Χρώματα Κειμένου" />
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Ζωντανή Προεπισκόπηση
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium mb-2">Κουμπιά</h5>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Κύριο</Button>
                  <Button variant="secondary" size="sm">Δευτερεύον</Button>
                  <Button variant="outline" size="sm">Περίγραμμα</Button>
                  <Button variant="destructive" size="sm">Σφάλμα</Button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Κάρτες</h5>
                <Card className="p-3">
                  <h6 className="text-sm font-semibold mb-1">Δείγμα Κάρτας</h6>
                  <p className="text-xs text-muted-foreground">
                    Αυτή η κάρτα δείχνει πώς φαίνονται τα χρώματα στην πράξη.
                  </p>
                </Card>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Ετικέτες</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge>Προεπιλογή</Badge>
                  <Badge variant="secondary">Δευτερεύον</Badge>
                  <Badge variant="outline">Περίγραμμα</Badge>
                  <Badge variant="destructive">Σφάλμα</Badge>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Στυλ Κειμένου</h5>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Κύριο Κείμενο</p>
                  <p className="text-sm text-muted-foreground">Δευτερεύον Κείμενο</p>
                  <p className="text-xs">Μικρό Κείμενο</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Τιμές Χρωμάτων
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

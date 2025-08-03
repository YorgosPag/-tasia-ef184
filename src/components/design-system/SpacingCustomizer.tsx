'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Rulers, 
  RotateCcw, 
  Copy, 
  Eye,
  Move,
  Square,
  RectangleHorizontal,
  Circle
} from 'lucide-react';

interface SpacingConfig {
  name: string;
  displayName: string;
  value: number;
  unit: 'px' | 'rem';
  category: 'spacing' | 'radius' | 'container' | 'grid';
  description: string;
}

const defaultSpacing: SpacingConfig[] = [
  // Spacing Scale
  { name: 'spacing-xs', displayName: 'Extra Small', value: 4, unit: 'px', category: 'spacing', description: 'Micro spacing' },
  { name: 'spacing-sm', displayName: 'Small', value: 8, unit: 'px', category: 'spacing', description: 'Small gaps' },
  { name: 'spacing-md', displayName: 'Medium', value: 16, unit: 'px', category: 'spacing', description: 'Default spacing' },
  { name: 'spacing-lg', displayName: 'Large', value: 24, unit: 'px', category: 'spacing', description: 'Large gaps' },
  { name: 'spacing-xl', displayName: 'Extra Large', value: 32, unit: 'px', category: 'spacing', description: 'Section spacing' },
  { name: 'spacing-2xl', displayName: '2X Large', value: 48, unit: 'px', category: 'spacing', description: 'Component spacing' },
  
  // Border Radius
  { name: 'radius-sm', displayName: 'Small Radius', value: 4, unit: 'px', category: 'radius', description: 'Buttons, inputs' },
  { name: 'radius-md', displayName: 'Medium Radius', value: 8, unit: 'px', category: 'radius', description: 'Cards, modals' },
  { name: 'radius-lg', displayName: 'Large Radius', value: 12, unit: 'px', category: 'radius', description: 'Large components' },
  { name: 'radius-full', displayName: 'Full Radius', value: 50, unit: '%', category: 'radius', description: 'Circular elements' },
  
  // Container Sizes
  { name: 'container-sm', displayName: 'Small Container', value: 640, unit: 'px', category: 'container', description: 'Mobile breakpoint' },
  { name: 'container-md', displayName: 'Medium Container', value: 768, unit: 'px', category: 'container', description: 'Tablet breakpoint' },
  { name: 'container-lg', displayName: 'Large Container', value: 1024, unit: 'px', category: 'container', description: 'Desktop breakpoint' },
  { name: 'container-xl', displayName: 'Extra Large Container', value: 1280, unit: 'px', category: 'container', description: 'Large desktop' },
  
  // Grid System
  { name: 'grid-gap', displayName: 'Grid Gap', value: 16, unit: 'px', category: 'grid', description: 'Grid column gap' },
  { name: 'grid-margin', displayName: 'Grid Margin', value: 24, unit: 'px', category: 'grid', description: 'Grid side margins' },
];

export function SpacingCustomizer() {
  const [spacing, setSpacing] = useState<SpacingConfig[]>(defaultSpacing);

  const updateSpacing = (name: string, property: keyof SpacingConfig, value: any) => {
    setSpacing(prev => prev.map(item => 
      item.name === name ? { ...item, [property]: value } : item
    ));
  };

  const resetSpacing = () => {
    setSpacing(defaultSpacing);
  };

  const exportCSS = () => {
    const cssVariables = spacing.map(item => {
      const unit = item.name.includes('radius-full') ? '%' : item.unit;
      return `  --${item.name}: ${item.value}${unit};`;
    }).join('\n');
    
    const cssExport = `:root {\n${cssVariables}\n}`;
    
    const blob = new Blob([cssExport], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spacing-system.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategorySpacing = (category: SpacingConfig['category']) => {
    return spacing.filter(item => item.category === category);
  };

  const SpacingEditor = ({ item }: { item: SpacingConfig }) => (
    <div className="space-y-3 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">{item.displayName}</h4>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {item.value}{item.unit}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Value</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={item.value}
              onChange={(e) => updateSpacing(item.name, 'value', parseInt(e.target.value) || 0)}
              className="h-8 flex-1"
              min="0"
              max={item.category === 'container' ? 2000 : 200}
            />
            <span className="text-xs text-muted-foreground min-w-[24px]">{item.unit}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Slider Control</Label>
          <Slider
            value={[item.value]}
            onValueChange={([value]) => updateSpacing(item.name, 'value', value)}
            min={0}
            max={item.category === 'container' ? 2000 : item.category === 'radius' ? 100 : 200}
            step={item.category === 'container' ? 10 : 1}
            className="w-full"
          />
        </div>
      </div>

      {/* Visual Preview */}
      <div className="pt-3 border-t">
        {item.category === 'spacing' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded"></div>
              <div style={{ width: `${item.value}px` }} className="bg-yellow-200 h-1"></div>
              <div className="w-8 h-8 bg-primary rounded"></div>
            </div>
            <span className="text-xs text-muted-foreground">Gap: {item.value}px</span>
          </div>
        )}
        
        {item.category === 'radius' && (
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 bg-primary"
              style={{ borderRadius: item.name.includes('full') ? '50%' : `${item.value}px` }}
            ></div>
            <span className="text-xs text-muted-foreground">
              Border radius: {item.value}{item.unit}
            </span>
          </div>
        )}
        
        {item.category === 'container' && (
          <div className="space-y-2">
            <div 
              className="h-4 bg-muted border-l-4 border-primary relative"
              style={{ maxWidth: `${Math.min(item.value, 300)}px`, width: '100%' }}
            >
              <span className="absolute right-2 top-0 text-xs text-muted-foreground">
                {item.value}px
              </span>
            </div>
          </div>
        )}
        
        {item.category === 'grid' && (
          <div className="grid grid-cols-3 bg-muted p-2 rounded" style={{ gap: `${Math.min(item.value, 16)}px` }}>
            <div className="h-8 bg-primary rounded"></div>
            <div className="h-8 bg-primary rounded"></div>
            <div className="h-8 bg-primary rounded"></div>
          </div>
        )}
      </div>
    </div>
  );

  const CategorySection = ({ category, title, icon }: { 
    category: SpacingConfig['category'], 
    title: string,
    icon: React.ReactNode 
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {getCategorySpacing(category).map((item) => (
          <SpacingEditor key={item.name} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Spacing Controls */}
      <div className="xl:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Rulers className="w-5 h-5" />
                Spacing & Layout System
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={resetSpacing}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={exportCSS}>
                  <Copy className="w-4 h-4 mr-2" />
                  Export CSS
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <CategorySection 
              category="spacing" 
              title="Spacing Scale" 
              icon={<Move className="w-5 h-5" />}
            />
            <CategorySection 
              category="radius" 
              title="Border Radius" 
              icon={<Circle className="w-5 h-5" />}
            />
            <CategorySection 
              category="container" 
              title="Container Sizes" 
              icon={<RectangleHorizontal className="w-5 h-5" />}
            />
            <CategorySection 
              category="grid" 
              title="Grid System" 
              icon={<Square className="w-5 h-5" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* Spacing Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Spacing Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {getCategorySpacing('spacing').map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.displayName}</span>
                    <span className="text-xs text-muted-foreground">{item.value}px</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded">
                    <div 
                      className="bg-primary h-2 rounded transition-all duration-200"
                      style={{ width: `${Math.min((item.value / 48) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="w-5 h-5" />
              Border Radius
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {getCategorySpacing('radius').map((item) => (
                <div key={item.name} className="text-center space-y-2">
                  <div 
                    className="w-12 h-12 bg-primary mx-auto"
                    style={{ 
                      borderRadius: item.name.includes('full') ? '50%' : `${item.value}px` 
                    }}
                  ></div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">{item.displayName}</p>
                    <p className="text-xs text-muted-foreground">{item.value}{item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="w-5 h-5" />
              Layout Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">Component Layout</div>
              <div 
                className="bg-card border rounded p-4 space-y-3"
                style={{ 
                  borderRadius: `${getCategorySpacing('radius')[1]?.value || 8}px`,
                  gap: `${getCategorySpacing('spacing')[2]?.value || 16}px`
                }}
              >
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div 
                  className="flex gap-2"
                  style={{ gap: `${getCategorySpacing('spacing')[1]?.value || 8}px` }}
                >
                  <div 
                    className="flex-1 h-8 bg-primary rounded"
                    style={{ borderRadius: `${getCategorySpacing('radius')[0]?.value || 4}px` }}
                  ></div>
                  <div 
                    className="flex-1 h-8 bg-secondary rounded"
                    style={{ borderRadius: `${getCategorySpacing('radius')[0]?.value || 4}px` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

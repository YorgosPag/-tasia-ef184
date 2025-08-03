'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  RotateCcw, 
  Copy, 
  Eye,
  AlignLeft,
  Bold,
  Italic
} from 'lucide-react';

interface FontConfig {
  name: string;
  displayName: string;
  family: string;
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  category: 'heading' | 'body' | 'caption' | 'ui';
}

const defaultFonts: FontConfig[] = [
  // Headings
  { name: 'h1', displayName: 'Heading 1', family: 'Inter', size: 32, weight: 700, lineHeight: 1.2, letterSpacing: -0.02, category: 'heading' },
  { name: 'h2', displayName: 'Heading 2', family: 'Inter', size: 28, weight: 600, lineHeight: 1.3, letterSpacing: -0.01, category: 'heading' },
  { name: 'h3', displayName: 'Heading 3', family: 'Inter', size: 24, weight: 600, lineHeight: 1.4, letterSpacing: 0, category: 'heading' },
  { name: 'h4', displayName: 'Heading 4', family: 'Inter', size: 20, weight: 500, lineHeight: 1.4, letterSpacing: 0, category: 'heading' },
  
  // Body Text
  { name: 'body-large', displayName: 'Body Large', family: 'Inter', size: 16, weight: 400, lineHeight: 1.6, letterSpacing: 0, category: 'body' },
  { name: 'body', displayName: 'Body', family: 'Inter', size: 14, weight: 400, lineHeight: 1.5, letterSpacing: 0, category: 'body' },
  { name: 'body-small', displayName: 'Body Small', family: 'Inter', size: 12, weight: 400, lineHeight: 1.4, letterSpacing: 0, category: 'body' },
  
  // Captions & Labels
  { name: 'caption', displayName: 'Caption', family: 'Inter', size: 11, weight: 400, lineHeight: 1.3, letterSpacing: 0.01, category: 'caption' },
  { name: 'label', displayName: 'Label', family: 'Inter', size: 12, weight: 500, lineHeight: 1.2, letterSpacing: 0.01, category: 'caption' },
  
  // UI Elements
  { name: 'button', displayName: 'Button', family: 'Inter', size: 14, weight: 500, lineHeight: 1.2, letterSpacing: 0, category: 'ui' },
  { name: 'input', displayName: 'Input', family: 'Inter', size: 14, weight: 400, lineHeight: 1.4, letterSpacing: 0, category: 'ui' },
];

const fontFamilies = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Source Sans Pro',
  'Nunito',
  'Poppins',
  'Montserrat',
  'Raleway',
  'PT Sans',
  'Georgia',
  'Times New Roman',
  'serif',
  'Arial',
  'Helvetica',
  'sans-serif',
  'Courier New',
  'Monaco',
  'monospace'
];

const fontWeights = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'Extra Light' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
];

export function TypographyCustomizer() {
  const [fonts, setFonts] = useState<FontConfig[]>(defaultFonts);

  const updateFont = (name: string, property: keyof FontConfig, value: any) => {
    setFonts(prev => prev.map(font => 
      font.name === name ? { ...font, [property]: value } : font
    ));
  };

  const resetFonts = () => {
    setFonts(defaultFonts);
  };

  const exportCSS = () => {
    const cssRules = fonts.map(font => {
      const className = `.${font.name}`;
      return `${className} {
  font-family: '${font.family}', sans-serif;
  font-size: ${font.size}px;
  font-weight: ${font.weight};
  line-height: ${font.lineHeight};
  letter-spacing: ${font.letterSpacing}em;
}`;
    }).join('\n\n');

    const blob = new Blob([cssRules], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryFonts = (category: FontConfig['category']) => {
    return fonts.filter(font => font.category === category);
  };

  const FontEditor = ({ font }: { font: FontConfig }) => (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{font.displayName}</h4>
          <Badge variant="outline" className="text-xs">
            {font.category}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Font Family</Label>
            <Select 
              value={font.family} 
              onValueChange={(value) => updateFont(font.name, 'family', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((family) => (
                  <SelectItem key={family} value={family} style={{ fontFamily: family }}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Font Weight</Label>
            <Select 
              value={font.weight.toString()} 
              onValueChange={(value) => updateFont(font.name, 'weight', parseInt(value))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value.toString()}>
                    {weight.label} ({weight.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Size: {font.size}px</Label>
            <Slider
              value={[font.size]}
              onValueChange={([value]) => updateFont(font.name, 'size', value)}
              min={8}
              max={72}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Line Height: {font.lineHeight}</Label>
            <Slider
              value={[font.lineHeight]}
              onValueChange={([value]) => updateFont(font.name, 'lineHeight', value)}
              min={0.8}
              max={2.5}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Letter Spacing: {font.letterSpacing}em</Label>
            <Slider
              value={[font.letterSpacing]}
              onValueChange={([value]) => updateFont(font.name, 'letterSpacing', value)}
              min={-0.1}
              max={0.2}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        <div className="pt-2 border-t">
          <p 
            className="text-foreground"
            style={{
              fontFamily: `'${font.family}', sans-serif`,
              fontSize: `${font.size}px`,
              fontWeight: font.weight,
              lineHeight: font.lineHeight,
              letterSpacing: `${font.letterSpacing}em`
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>
    </Card>
  );

  const CategorySection = ({ category, title }: { category: FontConfig['category'], title: string }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {getCategoryFonts(category).map((font) => (
          <FontEditor key={font.name} font={font} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Typography Controls */}
      <div className="xl:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Typography System
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={resetFonts}>
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
            <CategorySection category="heading" title="Headings" />
            <CategorySection category="body" title="Body Text" />
            <CategorySection category="caption" title="Captions & Labels" />
            <CategorySection category="ui" title="UI Elements" />
          </CardContent>
        </Card>
      </div>

      {/* Typography Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Typography Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fonts.map((font) => (
              <div key={font.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{font.displayName}</span>
                  <span className="text-xs text-muted-foreground">{font.size}px</span>
                </div>
                <p 
                  style={{
                    fontFamily: `'${font.family}', sans-serif`,
                    fontSize: `${Math.min(font.size, 24)}px`,
                    fontWeight: font.weight,
                    lineHeight: font.lineHeight,
                    letterSpacing: `${font.letterSpacing}em`
                  }}
                >
                  Sample Text
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlignLeft className="w-5 h-5" />
              Sample Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {getCategoryFonts('heading').map((font) => (
                <div key={font.name}>
                  <h1 
                    style={{
                      fontFamily: `'${font.family}', sans-serif`,
                      fontSize: `${Math.min(font.size, 20)}px`,
                      fontWeight: font.weight,
                      lineHeight: font.lineHeight,
                      letterSpacing: `${font.letterSpacing}em`
                    }}
                  >
                    {font.displayName}
                  </h1>
                </div>
              ))}
              
              <div className="pt-2 border-t">
                {getCategoryFonts('body').map((font) => (
                  <p 
                    key={font.name}
                    className="mb-2"
                    style={{
                      fontFamily: `'${font.family}', sans-serif`,
                      fontSize: `${font.size}px`,
                      fontWeight: font.weight,
                      lineHeight: font.lineHeight,
                      letterSpacing: `${font.letterSpacing}em`
                    }}
                  >
                    This is {font.displayName} text used for regular content.
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

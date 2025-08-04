'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Palette, Type, RectangleHorizontal, MoveCircle } from 'lucide-react';

interface ButtonVariantStyle {
  background: string;
  foreground: string;
  border: string;
  fontFamily: string;
  fontSize: number;
}

interface ButtonDimensionStyle {
    height: number;
    paddingX: number;
    borderRadius: number;
}

interface ButtonStyles {
  default: ButtonVariantStyle;
  destructive: ButtonVariantStyle;
  outline: ButtonVariantStyle;
  secondary: ButtonVariantStyle;
  ghost: ButtonVariantStyle;
  link: ButtonVariantStyle;
}

const fontFamilies = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Source Sans Pro', 'Nunito', 'Poppins', 'Montserrat', 'Raleway', 'PT Sans',
  'Georgia', 'Times New Roman', 'serif', 'Arial', 'Helvetica', 'sans-serif', 'Courier New', 'Monaco', 'monospace'
];

const initialButtonStyles: ButtonStyles = {
  default: { background: '#3B82F6', foreground: '#FFFFFF', border: '#3B82F6', fontFamily: 'Inter', fontSize: 14 },
  destructive: { background: '#EF4444', foreground: '#FFFFFF', border: '#EF4444', fontFamily: 'Inter', fontSize: 14 },
  outline: { background: 'transparent', foreground: '#0F172A', border: '#E2E8F0', fontFamily: 'Inter', fontSize: 14 },
  secondary: { background: '#F1F5F9', foreground: '#0F172A', border: '#F1F5F9', fontFamily: 'Inter', fontSize: 14 },
  ghost: { background: 'transparent', foreground: '#0F172A', border: 'transparent', fontFamily: 'Inter', fontSize: 14 },
  link: { background: 'transparent', foreground: '#3B82F6', border: 'transparent', fontFamily: 'Inter', fontSize: 14 },
};

const PRESET_COLORS = [
    '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#6366F1', '#8B5CF6'
];

export function ButtonCustomizer() {
  const [styles, setStyles] = useState<ButtonStyles>(initialButtonStyles);
  const [dimensions, setDimensions] = useState<ButtonDimensionStyle>({
    height: 40,
    paddingX: 16,
    borderRadius: 8,
  });

  const handleStyleChange = (variant: keyof ButtonStyles, property: keyof ButtonVariantStyle, value: string | number) => {
    setStyles(prev => ({
      ...prev,
      [variant]: {
        ...prev[variant],
        [property]: value
      }
    }));
  };
  
  const handleDimensionChange = (property: keyof ButtonDimensionStyle, value: number) => {
    setDimensions(prev => ({ ...prev, [property]: value }));
  };

  const StyleEditor = ({ variant, title }: { variant: keyof ButtonStyles, title: string }) => {
    const currentStyle = styles[variant];

    const ColorInputWithPresets = ({ label, id, value, onChange }: { label: string, id: string, value: string, onChange: (value: string) => void }) => (
      <div className="space-y-1">
        <Label htmlFor={id} className="text-xs">{label}</Label>
        <div className="flex items-center gap-2">
          <Input type="color" id={id} value={value} onChange={e => onChange(e.target.value)} className="h-10 w-12 p-1"/>
          <div className="flex flex-wrap gap-1">
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
      </div>
    );

    return (
    <Card className="p-4 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h4 className="font-medium mb-3">{title}</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ColorInputWithPresets label="Φόντο" id={`${variant}-bg`} value={currentStyle.background} onChange={(val) => handleStyleChange(variant, 'background', val)} />
              <ColorInputWithPresets label="Κείμενο" id={`${variant}-fg`} value={currentStyle.foreground} onChange={(val) => handleStyleChange(variant, 'foreground', val)} />
              <ColorInputWithPresets label="Περίγραμμα" id={`${variant}-border`} value={currentStyle.border} onChange={(val) => handleStyleChange(variant, 'border', val)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Γραμματοσειρά</Label>
                <Select value={currentStyle.fontFamily} onValueChange={(value) => handleStyleChange(variant, 'fontFamily', value)}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map(family => (
                      <SelectItem key={family} value={family} style={{ fontFamily: family }}>{family}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-1">
                 <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs">Μέγεθος</Label>
                    <div className="relative w-20">
                        <Input
                            type="number"
                            value={currentStyle.fontSize}
                            onChange={e => handleStyleChange(variant, 'fontSize', parseInt(e.target.value, 10) || 10)}
                            min={10}
                            max={24}
                            step={1}
                            className="h-7 text-xs pr-7"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            px
                        </span>
                    </div>
                 </div>
                <Slider 
                  value={[currentStyle.fontSize]} 
                  onValueChange={([val]) => handleStyleChange(variant, 'fontSize', val)}
                  min={10} max={24} step={1} 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg min-h-[100px]">
            <p className="text-xs text-muted-foreground mb-2 capitalize">{variant}</p>
            <Button
              style={{
                backgroundColor: currentStyle.background,
                color: currentStyle.foreground,
                borderColor: currentStyle.border,
                fontFamily: `'${currentStyle.fontFamily}', sans-serif`,
                fontSize: `${currentStyle.fontSize}px`,
                height: `${dimensions.height}px`,
                paddingLeft: `${dimensions.paddingX}px`,
                paddingRight: `${dimensions.paddingX}px`,
                borderRadius: `${dimensions.borderRadius}px`,
              }}
              className="border"
            >
              Κουμπί {variant}
            </Button>
        </div>
      </div>
    </Card>
    );
  };

  const DimensionControls = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RectangleHorizontal className="w-5 h-5" />
          Διαστάσεις Κουμπιών
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-xs">Ύψος</Label>
            <div className="relative w-20">
              <Input
                type="number"
                value={dimensions.height}
                onChange={e => handleDimensionChange('height', parseInt(e.target.value, 10) || 0)}
                className="h-7 text-xs pr-7"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
            </div>
          </div>
          <Slider value={[dimensions.height]} onValueChange={([val]) => handleDimensionChange('height', val)} min={24} max={64} step={1} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-xs">Padding (Οριζόντιο)</Label>
            <div className="relative w-20">
              <Input
                type="number"
                value={dimensions.paddingX}
                onChange={e => handleDimensionChange('paddingX', parseInt(e.target.value, 10) || 0)}
                className="h-7 text-xs pr-7"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
            </div>
          </div>
          <Slider value={[dimensions.paddingX]} onValueChange={([val]) => handleDimensionChange('paddingX', val)} min={8} max={48} step={1} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-xs">Ακτίνα Γωνιών</Label>
            <div className="relative w-20">
              <Input
                type="number"
                value={dimensions.borderRadius}
                onChange={e => handleDimensionChange('borderRadius', parseInt(e.target.value, 10) || 0)}
                className="h-7 text-xs pr-7"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
            </div>
          </div>
          <Slider value={[dimensions.borderRadius]} onValueChange={([val]) => handleDimensionChange('borderRadius', val)} min={0} max={32} step={1} />
        </div>
      </CardContent>
    </Card>
  );

  return (
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Παραμετροποίηση Κουμπιών
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DimensionControls />
            <StyleEditor variant="default" title="Προεπιλογή (Primary)" />
            <StyleEditor variant="destructive" title="Διαγραφή (Destructive)" />
            <StyleEditor variant="secondary" title="Δευτερεύον (Secondary)" />
            <StyleEditor variant="outline" title="Περίγραμμα (Outline)" />
            <StyleEditor variant="ghost" title="Ghost" />
            <StyleEditor variant="link" title="Σύνδεσμος (Link)" />
          </CardContent>
        </Card>
  );
}

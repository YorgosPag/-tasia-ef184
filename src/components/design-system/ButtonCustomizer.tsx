'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Palette, Type } from 'lucide-react';

interface ButtonVariantStyle {
  background: string;
  foreground: string;
  border: string;
  fontFamily: string;
  fontSize: number;
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

export function ButtonCustomizer() {
  const [styles, setStyles] = useState<ButtonStyles>(initialButtonStyles);

  const handleStyleChange = (variant: keyof ButtonStyles, property: keyof ButtonVariantStyle, value: string | number) => {
    setStyles(prev => ({
      ...prev,
      [variant]: {
        ...prev[variant],
        [property]: value
      }
    }));
  };

  const StyleEditor = ({ variant, title }: { variant: keyof ButtonStyles, title: string }) => {
    const currentStyle = styles[variant];
    return (
    <Card className="p-4 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h4 className="font-medium mb-3">{title}</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`${variant}-bg`} className="text-xs">Φόντο</Label>
                <Input type="color" id={`${variant}-bg`} value={currentStyle.background} onChange={e => handleStyleChange(variant, 'background', e.target.value)} className="h-10 w-full p-1"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${variant}-fg`} className="text-xs">Κείμενο</Label>
                <Input type="color" id={`${variant}-fg`} value={currentStyle.foreground} onChange={e => handleStyleChange(variant, 'foreground', e.target.value)} className="h-10 w-full p-1"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${variant}-border`} className="text-xs">Περίγραμμα</Label>
                <Input type="color" id={`${variant}-border`} value={currentStyle.border} onChange={e => handleStyleChange(variant, 'border', e.target.value)} className="h-10 w-full p-1"/>
              </div>
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
                fontSize: `${currentStyle.fontSize}px`
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

  return (
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Παραμετροποίηση Κουμπιών
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

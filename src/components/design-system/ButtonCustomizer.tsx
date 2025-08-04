'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface ButtonVariantStyle {
  background: string;
  foreground: string;
  border: string;
}

interface ButtonStyles {
  default: ButtonVariantStyle;
  destructive: ButtonVariantStyle;
  outline: ButtonVariantStyle;
  secondary: ButtonVariantStyle;
  ghost: ButtonVariantStyle;
  link: ButtonVariantStyle;
}

const initialButtonStyles: ButtonStyles = {
  default: { background: '#3B82F6', foreground: '#FFFFFF', border: '#3B82F6' },
  destructive: { background: '#EF4444', foreground: '#FFFFFF', border: '#EF4444' },
  outline: { background: 'transparent', foreground: '#0F172A', border: '#E2E8F0' },
  secondary: { background: '#F1F5F9', foreground: '#0F172A', border: '#F1F5F9' },
  ghost: { background: 'transparent', foreground: '#0F172A', border: 'transparent' },
  link: { background: 'transparent', foreground: '#3B82F6', border: 'transparent' },
};

export function ButtonCustomizer() {
  const [styles, setStyles] = useState<ButtonStyles>(initialButtonStyles);

  const handleStyleChange = (variant: keyof ButtonStyles, property: keyof ButtonVariantStyle, value: string) => {
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor={`${variant}-bg`} className="text-xs">Φόντο</Label>
              <Input type="color" id={`${variant}-bg`} value={currentStyle.background} onChange={e => handleStyleChange(variant, 'background', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${variant}-fg`} className="text-xs">Κείμενο</Label>
              <Input type="color" id={`${variant}-fg`} value={currentStyle.foreground} onChange={e => handleStyleChange(variant, 'foreground', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${variant}-border`} className="text-xs">Περίγραμμα</Label>
              <Input type="color" id={`${variant}-border`} value={currentStyle.border} onChange={e => handleStyleChange(variant, 'border', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg min-h-[100px]">
            <p className="text-xs text-muted-foreground mb-2 capitalize">{variant}</p>
            <Button
              style={{
                backgroundColor: currentStyle.background,
                color: currentStyle.foreground,
                borderColor: currentStyle.border
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

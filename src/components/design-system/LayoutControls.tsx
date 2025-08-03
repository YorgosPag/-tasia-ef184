'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  RectangleHorizontal,
  Move,
  Circle,
  BorderStyle,
  Shadow
} from 'lucide-react';
import type { LayoutSettings } from './LayoutCustomizer';

interface LayoutControlsProps {
  settings: LayoutSettings;
  updateSetting: (key: keyof LayoutSettings, value: number) => void;
}

const ControlSlider = ({ label, value, onValueChange, min, max, step }: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Label className="text-xs font-medium">{label}</Label>
      <span className="text-xs text-muted-foreground">{value}px</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([val]) => onValueChange(val)}
      min={min}
      max={max}
      step={step}
    />
  </div>
);

export function LayoutControls({ settings, updateSetting }: LayoutControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <RectangleHorizontal className="w-5 h-5" />
          Container Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-md">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Move className="w-4 h-4" />
            Spacing
          </h4>
          <ControlSlider 
            label="Padding"
            value={settings.padding}
            onValueChange={(val) => updateSetting('padding', val)}
            min={0}
            max={64}
            step={2}
          />
          <ControlSlider 
            label="Margin"
            value={settings.margin}
            onValueChange={(val) => updateSetting('margin', val)}
            min={0}
            max={64}
            step={2}
          />
        </div>

        <div className="space-y-4 p-4 border rounded-md">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Border Radius
          </h4>
          <ControlSlider 
            label="Radius"
            value={settings.borderRadius}
            onValueChange={(val) => updateSetting('borderRadius', val)}
            min={0}
            max={32}
            step={1}
          />
        </div>

        <div className="space-y-4 p-4 border rounded-md">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <BorderStyle className="w-4 h-4" />
            Border
          </h4>
          <ControlSlider 
            label="Border Width"
            value={settings.borderWidth}
            onValueChange={(val) => updateSetting('borderWidth', val)}
            min={0}
            max={12}
            step={1}
          />
        </div>
        
        <div className="space-y-4 p-4 border rounded-md">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Shadow className="w-4 h-4" />
            Shadow
          </h4>
          <ControlSlider 
            label="Shadow Opacity"
            value={settings.shadow}
            onValueChange={(val) => updateSetting('shadow', val)}
            min={0}
            max={100}
            step={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}

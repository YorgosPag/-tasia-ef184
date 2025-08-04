"use client";

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  renderOption?: (value: string) => React.ReactNode;
}

export function FilterGroup({
  title,
  options,
  selected,
  onChange,
  renderOption,
}: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{title}</Label>
      <div className="space-y-2">
        {options.map((value) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${value}`}
              checked={selected.includes(value)}
              onCheckedChange={(checked) =>
                onChange(value, checked as boolean)
              }
            />
            <Label
              htmlFor={`${title}-${value}`}
              className="text-sm cursor-pointer font-normal"
            >
              {renderOption ? renderOption(value) : value}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

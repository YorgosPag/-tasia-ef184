'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formatValue = (value: number | string, options: { useGrouping?: boolean; isPercentage?: boolean; decimals?: number } = {}) => {
    const { useGrouping = false, isPercentage = false, decimals = 2 } = options;
    let num = Number(String(value).replace(',', '.'));
    if (isNaN(num)) return isPercentage ? '0,00' : '0,00';
    
    if (isPercentage) {
      if (value > 1 && value <= 100) {
        num = value;
      } else {
        num *= 100;
      }
    }
    
    return num.toLocaleString('el-GR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: useGrouping,
    });
};

interface FormFieldProps {
    label: string;
    id: string;
    unit?: string;
    value: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    labelPosition?: 'left' | 'right';
    unitPosition?: 'left' | 'right';
    useGrouping?: boolean;
    onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    labelClassName?: string;
    inputClassName?: string;
    tooltipText?: string;
    isPercentage?: boolean;
}

export function FormField({
    label,
    id,
    unit,
    value,
    onChange,
    readOnly = false,
    labelPosition = 'right',
    unitPosition = 'right',
    useGrouping = false,
    onEnterPress,
    labelClassName,
    inputClassName,
    tooltipText,
    isPercentage = false,
}: FormFieldProps) {
    const [internalValue, setInternalValue] = useState(formatValue(value, { useGrouping, isPercentage }));

    useEffect(() => {
        if (document.activeElement?.id !== id) {
            setInternalValue(formatValue(value, { useGrouping, isPercentage }));
        }
    }, [value, useGrouping, isPercentage, id]);

    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(e.target.value);
    };
    
    const triggerChange = (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        let normalizedValue = target.value.replace(/\./g, '').replace(',', '.'); // Handle thousand separators and decimal comma
        let numValue = parseFloat(normalizedValue) || 0;
        
        if (isPercentage) {
          numValue /= 100;
        }

        setInternalValue(formatValue(numValue, { useGrouping, isPercentage }));
        
        if (onChange) {
            const syntheticEvent = {
                target: { name: target.name, value: String(numValue) }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };
    
    const handlePercentageChange = (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        let normalizedValue = target.value.replace(/\./g, '').replace(',', '.');
        let numValue = parseFloat(normalizedValue) || 0;

        setInternalValue(formatValue(numValue, { useGrouping, isPercentage:true }));

        if (onChange) {
            const syntheticEvent = {
                target: { name: target.name, value: String(numValue)}
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
       if (isPercentage) {
          handlePercentageChange(e);
       } else {
          triggerChange(e);
       }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (isPercentage) {
                handlePercentageChange(e);
            } else {
                triggerChange(e);
            }
            onEnterPress?.(e);
        }
    };
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const inputField = (
        <div className={cn("grid items-center", labelPosition === 'left' ? "grid-cols-[1fr_auto]" : "grid-cols-[auto_1fr]")}>
            {labelPosition === 'left' && <Label htmlFor={id} className={cn("text-sm font-medium text-right pr-2", labelClassName)}>{label}</Label>}
            <div className="relative flex items-center">
                {unit && unitPosition === 'left' && <span className="absolute left-3 text-sm text-muted-foreground z-10 pointer-events-none">{unit}</span>}
                <Input 
                    id={id} 
                    name={id} 
                    type="text"
                    value={readOnly ? formatValue(value, { useGrouping, isPercentage }) : internalValue}
                    onChange={handleInternalChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    readOnly={readOnly}
                    className={cn(
                        "h-8 text-right",
                        readOnly && "bg-muted/50 font-medium",
                        unit && unitPosition === 'left' && (isPercentage ? "pl-8" : "pl-12"),
                        unit && unitPosition === 'right' && "pr-8",
                        inputClassName
                    )}
                />
                {unit && unitPosition === 'right' && <span className="absolute right-3 text-sm text-muted-foreground pointer-events-none">{unit}</span>}
            </div>
            {labelPosition === 'right' && <Label htmlFor={id} className={cn("text-sm font-medium text-left pl-2", labelClassName)}>{label}</Label>}
        </div>
    );
    
    if (tooltipText) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {inputField}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipText}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    
    return inputField;
};
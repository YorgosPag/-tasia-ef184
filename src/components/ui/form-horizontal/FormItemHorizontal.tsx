"use client";

import * as React from "react";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form";

interface FormItemHorizontalProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
  }) => React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FormItemHorizontal<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  render,
  className,
  labelClassName,
}: FormItemHorizontalProps<TFieldValues, TName>) {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);
  const id = `${name}-${React.useId()}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0",
            className,
          )}
        >
          <Label
            htmlFor={id}
            className={cn(
              "sm:w-40 sm:text-right sm:pt-2.5 shrink-0",
              fieldState.error && "text-destructive",
              labelClassName,
            )}
          >
            {label}
          </Label>
          <div className="flex-1 w-full space-y-2">
            {React.cloneElement(render({ field }) as React.ReactElement, {
              id,
            })}
            <FormMessage />
          </div>
        </div>
      )}
    />
  );
}

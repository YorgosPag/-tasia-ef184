'use client';

import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/shared/components/ui/form';
import { Switch } from '@/shared/components/ui/switch';

export function BooleanSwitchField({ control, name, label, description }: {
  control: any;
  name: string;
  label: string;
  description?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-w-[250px]">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

'use client';

import { Checkbox } from '@/shared/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { AMENITIES_LIST } from '@/shared/lib/unit-helpers';

export function AmenitiesChecklist({ control }: { control: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
      {AMENITIES_LIST.map((item) => (
        <FormField
          key={item.id}
          control={control}
          name="amenities"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes(item.id)}
                  onCheckedChange={(checked) =>
                    checked
                      ? field.onChange([...(field.value || []), item.id])
                      : field.onChange((field.value || []).filter((v: string) => v !== item.id))
                  }
                />
              </FormControl>
              <FormLabel className="font-normal">{item.label}</FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}

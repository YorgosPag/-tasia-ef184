
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface CreatableComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onCreate: (value: string) => Promise<string | null>; // Returns the new value/id or null
  placeholder?: string;
}

export function CreatableCombobox({ options, value, onChange, onCreate, placeholder }: CreatableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!searchQuery) return;
    setIsCreating(true);
    const newId = await onCreate(searchQuery);
    if (newId) {
      onChange(searchQuery); // Change to the new value directly
      setOpen(false);
    }
    setIsCreating(false);
    setSearchQuery('');
  };

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));
  const showCreateOption = searchQuery && !filteredOptions.some(opt => opt.label.toLowerCase() === searchQuery.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value || (placeholder || "Επιλέξτε...")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Αναζήτηση ή δημιουργία..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
                {showCreateOption ? (
                    <Button variant="ghost" className="w-full" onClick={handleCreate} disabled={isCreating}>
                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        Δημιουργία &quot;{searchQuery}&quot;
                    </Button>
                ) : (
                    <span>Δεν βρέθηκαν αποτελέσματα.</span>
                )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

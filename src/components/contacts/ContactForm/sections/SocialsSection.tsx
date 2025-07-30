
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { type ContactFormProps } from '../types';
import { SocialFieldSet } from './socials/SocialFieldSet';


export function SocialsSection({ form }: ContactFormProps) {
    const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });

    return (
        <div className="space-y-4 p-1">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Κοινωνικά Δίκτυα & Websites</h3>
                    <Button type="button" variant="ghost" size="sm" onClick={() => appendSocial({ type: 'Website', label: 'Επαγγελματικό', url: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Link
                    </Button>
                </div>
                <div className="w-full space-y-2">
                    {socialFields.map((field, index) => (
                        <SocialFieldSet 
                            key={field.id}
                            form={form}
                            index={index}
                            onRemove={() => removeSocial(index)}
                        />
                    ))}
                </div>
            </div>
      </div>
    );
}

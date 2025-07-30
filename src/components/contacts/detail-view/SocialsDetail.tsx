
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { socialIcons } from '../ContactForm/utils/socialIcons';
import { ContactFormValues } from '@/lib/validation/contactSchema';

interface SocialsDetailProps {
    socials: ContactFormValues['socials'];
}

export function SocialsDetail({ socials }: SocialsDetailProps) {
    if (!socials || socials.length === 0) {
        return null;
    }

    return (
        <>
            {socials.map((social, i) => {
                const Icon = socialIcons[social.type] || socialIcons.default;
                return (
                    <div key={i} className="flex items-center text-sm gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground"/>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex-1 truncate">{social.url}</a>
                        <Badge variant="outline" className="text-xs">{social.type}</Badge>
                        <Badge variant={social.label === 'Επαγγελματικό' ? 'secondary' : 'outline'} className="text-xs">{social.label}</Badge>
                    </div>
                );
            })}
        </>
    );
}

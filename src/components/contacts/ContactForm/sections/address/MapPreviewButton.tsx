
'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Map as MapIcon } from 'lucide-react';

interface MapPreviewButtonProps {
    fullAddress: string;
}

export function MapPreviewButton({ fullAddress }: MapPreviewButtonProps) {
    const googleMapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;

    if (!googleMapsUrl) {
        return null;
    }

    return (
        <div className="flex justify-end pt-2">
            <Button asChild variant="outline" size="sm" type="button">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapIcon className="mr-2 h-4 w-4" />
                    Προβολή στον Χάρτη
                </a>
            </Button>
        </div>
    );
}

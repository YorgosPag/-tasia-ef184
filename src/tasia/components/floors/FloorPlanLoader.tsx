
'use client';

import { Loader2 } from 'lucide-react';

// This component is now a placeholder as react-pdf and its dynamic import were removed.
export const FloorPlanLoader = () => {
    return (
        <div className="flex h-40 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
             <p className="ml-2">Φόρτωση...</p>
        </div>
    );
};

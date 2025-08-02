"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProjectManagementRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/projects');
    }, [router]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
            <p className="ml-4">Ανακατεύθυνση...</p>
        </div>
    );
}

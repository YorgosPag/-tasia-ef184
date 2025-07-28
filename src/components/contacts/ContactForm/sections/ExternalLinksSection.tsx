
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useWatchedFields } from '../hooks/useWatchedFields';
import type { ContactFormProps } from '../types';

export function ExternalLinksSection({ form }: Pick<ContactFormProps, 'form'>) {
    const { externalLinks } = useWatchedFields(form);

    return (
        <Card className="relative border-muted">
            <CardHeader>
                <CardTitle className="text-lg">Σύνδεσμοι Τρίτων Φορέων</CardTitle>
                <CardDescription>🛈 Σύνδεσμοι προς εξωτερικές υπηρεσίες που αφορούν την επιχείρηση.</CardDescription>
            </CardHeader>
            <CardContent>
                {externalLinks?.length > 0 ? (
                    <div className="space-y-2">
                        {externalLinks.map((link: any, idx: number) => (
                            <div key={idx} className="flex items-center">
                                <Button asChild variant="link" className="p-0 h-auto">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                        {link.label}
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">Δεν υπάρχουν διαθέσιμοι σύνδεσμοι.</p>
                )}
            </CardContent>
        </Card>
    );
}

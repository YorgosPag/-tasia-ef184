
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useWorkStageCalendar } from '@/hooks/use-work-stage-calendar';
import { getStatusVariant } from '@/components/projects/work-stages/utils';

export default function ConstructionCalendarPage() {
    const { events, isLoading, month, setMonth } = useWorkStageCalendar();

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Ημερολόγιο Κατασκευής
            </h1>
            <Card>
                <CardContent className="p-2 md:p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[50vh]">
                            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Calendar
                            mode="multiple"
                            month={month}
                            onMonthChange={setMonth}
                            modifiers={{
                                event: events.map(e => e.date),
                            }}
                            modifiersClassNames={{
                                event: 'event-day',
                            }}
                            className="w-full"
                            components={{
                                DayContent: ({ date }) => {
                                    const dayEvents = events.filter(e => e.date.toDateString() === date.toDateString());
                                    return (
                                        <div className="relative h-full w-full">
                                            <time dateTime={date.toISOString()}>{date.getDate()}</time>
                                            {dayEvents.length > 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 p-0.5">
                                                    {dayEvents.slice(0, 3).map((event, index) => (
                                                        <div
                                                            key={`${event.id}-${event.type}-${index}`}
                                                            className={`h-1.5 w-1.5 rounded-full ${event.color}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                },
                            }}
                        />
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Επεξήγηση</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Badge variant={getStatusVariant('Εκκρεμεί')}>Εκκρεμεί</Badge>
                    <Badge variant={getStatusVariant('Σε εξέλιξη')}>Σε εξέλιξη</Badge>
                    <Badge variant={getStatusVariant('Ολοκληρώθηκε')}>Ολοκληρώθηκε</Badge>
                    <Badge variant={getStatusVariant('Καθυστερεί')}>Καθυστερεί</Badge>
                </CardContent>
            </Card>
        </div>
    );
}

// Some custom styles for the calendar day with events
const style = document.createElement('style');
style.innerHTML = `
.event-day {
    position: relative;
}
`;
if (typeof window !== 'undefined') {
    document.head.appendChild(style);
}

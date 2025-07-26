
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Calendar } from '@/shared/components/ui/calendar';
import { useWorkStageCalendar } from '@/shared/hooks/use-work-stage-calendar';
import { Badge } from '@/shared/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

export default function CalendarPage() {
    const { events, isLoading, month, setMonth } = useWorkStageCalendar();
    
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Ημερολόγιο</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Ημερολόγιο Έργων</CardTitle>
                    <CardDescription>
                        Επισκόπηση των ημερομηνιών έναρξης, λήξης και προθεσμιών για όλα τα στάδια εργασίας.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   {isLoading ? (
                     <div className="flex justify-center items-center h-96">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                   ) : (
                    <TooltipProvider>
                        <Calendar
                            mode="multiple"
                            selected={events.map(e => e.date)}
                            month={month}
                            onMonthChange={setMonth}
                            className="p-0"
                            components={{
                                Day: ({ date, displayMonth }) => {
                                    const dayEvents = events.filter(e => e.date.toDateString() === date.toDateString());
                                    const isOutside = date.getMonth() !== displayMonth.getMonth();
                                    
                                    return (
                                        <div className={`h-full w-full relative p-1 border border-transparent ${isOutside ? 'text-muted-foreground opacity-50' : ''}`}>
                                            <time dateTime={date.toISOString()} className="absolute top-1 right-1 text-xs">{date.getDate()}</time>
                                            <div className="flex flex-col gap-1 mt-4">
                                                {dayEvents.map(event => (
                                                    <Tooltip key={event.id}>
                                                        <TooltipTrigger asChild>
                                                            <div className={`${event.color} h-1.5 w-full rounded-full`}></div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{event.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                },
                            }}
                        />
                    </TooltipProvider>
                   )}
                </CardContent>
            </Card>
        </div>
    );
}

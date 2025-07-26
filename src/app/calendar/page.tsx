
'use client';

import { useWorkStageCalendar } from '@/shared/hooks/use-work-stage-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Calendar } from '@/shared/components/ui/calendar';
import { Badge } from '@/shared/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

export default function CalendarPage() {
  const { events, isLoading, month, setMonth } = useWorkStageCalendar();

  const DayWithEvents = ({ date, ...props }: { date: Date } & any) => {
    const dayEvents = events.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'relative h-9 w-9 p-0 font-normal',
              dayEvents.length > 0 && 'font-bold'
            )}
            {...props}
          >
            {props.children}
            {dayEvents.length > 0 && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={`${event.id}-${event.type}`}
                    className={`h-1.5 w-1.5 rounded-full ${event.color}`}
                  />
                ))}
              </div>
            )}
          </div>
        </PopoverTrigger>
        {dayEvents.length > 0 && (
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  Εκδηλώσεις - {date.toLocaleDateString()}
                </h4>
              </div>
              <div className="grid gap-2">
                {dayEvents.map((event) => (
                  <div
                    key={`${event.id}-${event.type}`}
                    className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className={`flex h-2 w-2 translate-y-1 rounded-full ${event.color}`} />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {event.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Κατάσταση: {event.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Ημερολόγιο Κατασκευής</h1>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-[500px]">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              className="p-0"
              classNames={{
                root: 'w-full',
                months: 'w-full',
                month: 'w-full space-y-4',
                table: 'w-full border-collapse',
                head_row: 'flex w-full',
                head_cell: 'w-full rounded-md text-muted-foreground',
                row: 'flex w-full mt-2',
                cell: 'h-full w-full text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
                day: 'h-14 w-full rounded-md',
              }}
              components={{
                Day: DayWithEvents,
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
            <Badge variant="outline">Εκκρεμεί</Badge>
            <Badge variant="secondary">Σε εξέλιξη</Badge>
            <Badge variant="default">Ολοκληρώθηκε</Badge>
            <Badge variant="destructive">Καθυστερεί</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

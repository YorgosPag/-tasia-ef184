'use client';

interface PlaceholderTabProps {
    title: string;
}

export function PlaceholderTab({ title }: PlaceholderTabProps) {
    return (
        <div className="flex items-center justify-center h-full p-8 border rounded-md bg-background">
            <h2 className="text-xl font-semibold text-muted-foreground">{title}</h2>
        </div>
    );
}

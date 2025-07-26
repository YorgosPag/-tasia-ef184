
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { el } from 'date-fns/locale';
import { MessageSquare } from 'lucide-react';
import type { WorkStageComment } from '@/app/projects/[id]/page';

interface WorkStageCommentsThreadProps {
    comments: WorkStageComment[];
}

function getInitials(email: string | undefined) {
    if (!email) return '??';
    return email.substring(0, 2).toUpperCase();
}


export function WorkStageCommentsThread({ comments }: WorkStageCommentsThreadProps) {

    if (!comments || comments.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-4 text-sm">
                <MessageSquare className="mx-auto h-6 w-6" />
                <p className="mt-2">Δεν υπάρχουν σχόλια ακόμα.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(comment.authorEmail)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-md bg-muted/50 p-3">
                        <div className="flex items-baseline justify-between">
                            <p className="font-semibold text-sm">{comment.authorEmail}</p>
                            <time className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: el })}
                            </time>
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

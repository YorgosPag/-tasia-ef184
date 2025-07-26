
'use client';

import { useState } from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface WorkStageCommentFormProps {
    onSubmit: (comment: string) => void;
}

export function WorkStageCommentForm({ onSubmit }: WorkStageCommentFormProps) {
    const { user } = useAuth();
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (comment.trim() && user) {
            onSubmit(comment);
            setComment('');
        }
    };

    return (
        <CardFooter className="flex gap-2">
             <Textarea 
                placeholder="Προσθήκη σχολίου..." 
                className="flex-1"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />
             <Button size="sm" onClick={handleSubmit} disabled={!comment.trim()}>
                 <MessageSquare className="mr-2"/>
                 Υποβολή
             </Button>
        </CardFooter>
    );
}

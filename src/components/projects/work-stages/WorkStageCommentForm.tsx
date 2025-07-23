
'use client';

import { useState } from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare } from 'lucide-react';

interface WorkStageCommentFormProps {
    onSubmit: (comment: string, files: FileList | null) => void;
}

export function WorkStageCommentForm({ onSubmit }: WorkStageCommentFormProps) {
    const [comment, setComment] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);

    const handleSubmit = () => {
        if (comment.trim() || (files && files.length > 0)) {
            onSubmit(comment, files);
            setComment('');
            setFiles(null);
            // Clear the file input visually
            const fileInput = document.getElementById('comment-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
    };

    return (
        <CardFooter>
             <div className="w-full space-y-2">
                <h4 className="text-sm font-medium">Προσθήκη Σχολίου</h4>
                 <Textarea 
                    placeholder="Γράψτε το σχόλιό σας..." 
                    className="w-full"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                 <div className="flex justify-between items-center">
                    <Input 
                        id="comment-file-input"
                        type="file" 
                        className="max-w-xs text-xs" 
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                    />
                     <Button size="sm" onClick={handleSubmit}>
                         <MessageSquare className="mr-2"/>
                         Υποβολή
                     </Button>
                 </div>
             </div>
        </CardFooter>
    );
}


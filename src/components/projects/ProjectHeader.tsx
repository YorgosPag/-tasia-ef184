

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import type { ProjectWithWorkStageSummary as Project } from '@/lib/types/project-types';

interface ProjectHeaderProps {
    project: Project;
}

const formatDate = (timestamp?: Timestamp | Date) => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return format(date, 'dd/MM/yyyy');
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
    return (
        <Card>
            <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.location} | Προθεσμία: {formatDate(project.deadline)} | Κατάσταση: {project.status}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 md:flex-row">
                {project.photoUrl && (
                    <div className="md:w-1/3 relative aspect-[4/3]">
                        <Image src={project.photoUrl} alt={`Photo of ${project.title}`} fill className="rounded-lg object-contain" loading="lazy"/>
                    </div>
                )}
                <div className="flex-1 space-y-4">
                    {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">{project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

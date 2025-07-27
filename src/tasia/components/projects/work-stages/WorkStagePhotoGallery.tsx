
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/components/ui/carousel';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Upload, CameraOff } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import type { WorkStage } from '@/shared/types/project-types';

interface WorkStagePhotoGalleryProps {
    stage: WorkStage;
    onPhotoUpload: (files: FileList) => void;
}

const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return 'Άγνωστη ημερομηνία';
    return format(timestamp.toDate(), 'dd MMM yyyy, HH:mm', { locale: el });
};

export function WorkStagePhotoGallery({ stage, onPhotoUpload }: WorkStagePhotoGalleryProps) {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleUploadClick = async () => {
        if (!selectedFiles) return;
        setIsUploading(true);
        await onPhotoUpload(selectedFiles);
        setIsUploading(false);
        setSelectedFiles(null);
        // Reset file input
        const input = document.getElementById(`photo-upload-${stage.id}`) as HTMLInputElement;
        if (input) input.value = '';
    };

    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Φωτογραφίες Προόδου ({stage.photos?.length || 0})</CardTitle>
                <div className="flex items-center gap-2">
                    <Input
                        id={`photo-upload-${stage.id}`}
                        type="file"
                        multiple
                        accept="image/*"
                        className="max-w-xs text-xs h-9"
                        onChange={handleFileChange}
                    />
                    <Button size="sm" onClick={handleUploadClick} disabled={!selectedFiles || isUploading}>
                        <Upload className="mr-2" />
                        {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {stage.photos && stage.photos.length > 0 ? (
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {stage.photos.map((photo, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex flex-col aspect-square items-center justify-center p-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={photo.url}
                                                    alt={`Progress photo ${index + 1}`}
                                                    width={400}
                                                    height={400}
                                                    className="object-contain w-full h-full"
                                                />
                                            </CardContent>
                                            <div className="text-xs text-muted-foreground p-2 text-center">
                                                <p>{formatDate(photo.uploadedAt)}</p>
                                                <p>από {photo.uploadedBy}</p>
                                            </div>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-24">
                        <CameraOff className="h-8 w-8" />
                        <p className="mt-2 text-sm">Δεν υπάρχουν φωτογραφίες για αυτό το στάδιο.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

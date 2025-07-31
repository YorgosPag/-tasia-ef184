
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, Square, ArrowRight, ZoomIn } from 'lucide-react';
import { getStatusClass } from '@/lib/unit-helpers';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

interface Unit {
  id: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος' | 'Προς Ενοικίαση';
  area?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  photoUrl?: string;
}

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
    const formatPrice = (price?: number) => {
        if (!price) return 'Κατόπιν Ερωτήσεως';
        return `€${price.toLocaleString('el-GR')}`;
    };

    const imageUrl = unit.photoUrl || "https://placehold.co/600x400.png";

    return (
        <Card className="overflow-hidden group flex flex-col">
             <div className="relative aspect-square w-full bg-muted/20">
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="relative w-full h-full cursor-pointer">
                            <Image 
                                src={imageUrl}
                                alt={`Photo of ${unit.name}`}
                                fill
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                data-ai-hint="modern apartment interior"
                            />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn className="h-10 w-10 text-white" />
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[90vh] p-2 bg-transparent border-none flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image src={imageUrl} alt={`Photo of ${unit.name}`} fill sizes="100vw" className="object-contain" />
                        </div>
                    </DialogContent>
                </Dialog>
                <Badge className={`absolute top-2 right-2 ${getStatusClass(unit.status)}`}>
                    {unit.status}
                </Badge>
            </div>
            <Link href={`/units/${unit.id}`} className="flex flex-col h-full flex-grow">
                <CardHeader className="flex-grow">
                  <CardTitle>{unit.name}</CardTitle>
                  <CardDescription>{unit.type || 'Ακίνητο'}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><BedDouble size={16}/><span>{unit.bedrooms || '-'}</span></div>
                    <div className="flex items-center gap-1"><Bath size={16}/><span>{unit.bathrooms || '-'}</span></div>
                    <div className="flex items-center gap-1"><Square size={16}/><span>{unit.area || '-'} τ.μ.</span></div>
                </CardContent>
                <CardFooter className="flex justify-between items-center mt-auto pt-4">
                    <span className="text-xl font-bold text-foreground">{formatPrice(unit.price)}</span>
                    <Button variant="ghost" size="sm" asChild>
                        <span>
                            Λεπτομέρειες <ArrowRight size={16} className="ml-1"/>
                        </span>
                    </Button>
                </CardFooter>
            </Link>
        </Card>
    )
}

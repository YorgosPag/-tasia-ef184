
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { BedDouble, Bath, Square, ArrowRight } from 'lucide-react';
import { getStatusClass } from '@/tasia/lib/unit-helpers';

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

    return (
        <Card className="overflow-hidden group flex flex-col">
            <Link href={`/units/${unit.id}`} className="flex flex-col h-full">
                <div className="relative aspect-[4/3] w-full">
                    <Image 
                        src={unit.photoUrl || "https://placehold.co/600x400.png"}
                        alt={`Photo of ${unit.name}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint="modern apartment interior"
                    />
                     <Badge className={`absolute top-2 right-2 ${getStatusClass(unit.status)}`}>
                        {unit.status}
                    </Badge>
                </div>
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


'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Star } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 py-10 px-4">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-4 text-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
           Τα έργα μας – τα σπίτια του αύριο σήμερα
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Ανακαλύψτε μοναδικά ακίνητα στα πιο σύγχρονα έργα μας. Βρείτε τον χώρο που σας ταιριάζει με ευκολία και ακρίβεια.
        </p>
        <div className="mt-4 w-full max-w-md">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Τι ψάχνετε;"
                className="pl-12 h-12 text-base"
              />
           </div>
           <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button asChild size="lg" className="flex-1">
                    <Link href="/units">
                        Βρες το σπίτι σου
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="flex-1">
                    <Link href="/projects">
                        Δες τα έργα μας
                    </Link>
                </Button>
           </div>
        </div>
      </div>
      
      {/* Featured Properties Section */}
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
            Διαθέσιμα Ακίνητα
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Static Property Card 1 */}
          <Card className="overflow-hidden group">
             <Link href="/units">
                <div className="relative">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="Modern Apartment"
                        width={600}
                        height={400}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="modern apartment"
                    />
                     <Badge className="absolute top-2 right-2" variant="default">Διαθέσιμο</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Νεόδμητο Διαμέρισμα</CardTitle>
                  <CardDescription>Γλυφάδα, Αθήνα</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center font-semibold">
                    <span>120 τ.μ.</span>
                    <span>€ 450.000</span>
                </CardContent>
             </Link>
          </Card>
          {/* Static Property Card 2 */}
          <Card className="overflow-hidden group">
             <Link href="/units">
                <div className="relative">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="Suburban Villa"
                        width={600}
                        height={400}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="suburban villa"
                    />
                     <Badge className="absolute top-2 right-2" variant="default">Διαθέσιμο</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Πολυτελής Μεζονέτα</CardTitle>
                  <CardDescription>Κηφισιά, Αθήνα</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center font-semibold">
                    <span>250 τ.μ.</span>
                    <span>€ 850.000</span>
                </CardContent>
             </Link>
          </Card>
          {/* Static Property Card 3 */}
          <Card className="overflow-hidden group">
             <Link href="/units">
                <div className="relative">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="City Loft"
                        width={600}
                        height={400}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="city loft"
                    />
                     <Badge className="absolute top-2 right-2" variant="default">Διαθέσιμο</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Μοντέρνο Loft</CardTitle>
                  <CardDescription>Κέντρο, Θεσσαλονίκη</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center font-semibold">
                    <span>85 τ.μ.</span>
                    <span>€ 280.000</span>
                </CardContent>
             </Link>
          </Card>
        </div>
         <div className="text-center mt-8">
            <Button asChild variant="outline">
                <Link href="/units">Δείτε Όλα τα Ακίνητα <ArrowRight className="ml-2" /></Link>
            </Button>
        </div>
      </div>
        <footer className="w-full max-w-6xl mt-12 border-t pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NestorConstruct. All rights reserved.</p>
            <p className="text-sm mt-2">Τηλέφωνο: 210-1234567 | Email: info@nestorconstruct.gr</p>
        </footer>
    </div>
  );
}

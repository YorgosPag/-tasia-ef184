
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Building2, Briefcase } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center pt-10">
      
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
          Ευρετήριο Ακινήτων TASIA
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Ανακαλύψτε μοναδικά ακίνητα στα έργα μας. Βρείτε τον χώρο που σας ταιριάζει με ευκολία και ακρίβεια.
        </p>
         <Button asChild size="lg" className="mt-4">
          <Link href="/units">
            Έναρξη Αναζήτησης
            <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
        <Card className="text-left">
          <CardHeader>
            <Briefcase className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Εξερεύνηση Έργων</CardTitle>
            <CardDescription>
              Δείτε τα ολοκληρωμένα και μελλοντικά μας έργα.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild variant="outline">
                <Link href="/projects">Προβολή Έργων</Link>
             </Button>
          </CardContent>
        </Card>
        
         <Card className="text-left">
          <CardHeader>
            <Building className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Αναλυτικά τα Κτίρια</CardTitle>
            <CardDescription>
              Περιηγηθείτε στα κτίρια και τις προδιαγραφές τους.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild variant="outline">
                <Link href="/buildings">Προβολή Κτιρίων</Link>
             </Button>
          </CardContent>
        </Card>

        <Card className="text-left">
          <CardHeader>
            <Building2 className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Οι Εταιρείες μας</CardTitle>
            <CardDescription>
              Γνωρίστε τις κατασκευαστικές εταιρείες πίσω από τα έργα.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/companies">Προβολή Εταιρειών</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

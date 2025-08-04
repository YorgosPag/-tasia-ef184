"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import type { Property } from '@/types/property';

interface PropertyContractsTabProps {
  property: Property;
  isEditing: boolean;
}

export function PropertyContractsTab({ property, isEditing }: PropertyContractsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Συμβόλαια
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Πελάτης</Label>
          <Input defaultValue={property.buyer || "ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ"} className="h-10" disabled={!isEditing} />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Προσύμφωνο</Label>
          <div className="flex items-center gap-2">
            <Input defaultValue="430" className="h-10" disabled={!isEditing} />
            <span className="text-sm text-muted-foreground">Ημερ. Συμβολαίου</span>
            <Input defaultValue="25/1/2008" className="h-10" disabled={!isEditing} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Αρχείο Συμβολαίου</Label>
          <Input 
            defaultValue="\\\\Server\\shared\\6. erga\\Palaiologou\\Paleol_Gen\\Paleol_Gen_Symbolaia\\Προσύμφωνο ΚΞΛεσσοδι Γιελένα 430 25-1-08 OCR.pdf"
            className="h-10 text-xs" 
            disabled={!isEditing} 
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Συμβολαιογράφος</Label>
          <Input defaultValue="ΣΑΓΕΠΙΔΗ ΣΤΥΛΙΑΝΗ" className="h-10" disabled={!isEditing} />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Οριστικό Συμβόλαιο</Label>
          <div className="flex items-center gap-2">
            <Input defaultValue="17518" className="h-10" disabled={!isEditing} />
            <span className="text-sm text-muted-foreground">Ημερ. Συμβολαίου</span>
            <Input defaultValue="1/9/2011" className="h-10" disabled={!isEditing} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Αρχείο Συμβολαίου</Label>
          <Input 
            defaultValue="\\\\Server\\shared\\6. erga\\Palaiologou\\Paleol_Gen\\Paleol_Gen_Symbolaia\\Οριστικό Κελεσσοδι Γιελένα 17518 01-09-2011 OCR.pdf"
            className="h-10 text-xs" 
            disabled={!isEditing} 
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Συμβολαιογράφος</Label>
          <Input defaultValue="ΛΑΖΑΡΙΔΟΥ - ΓΡΗΓΟΡΙΑΔΟΥ ΜΑΡΙΑ" className="h-10" disabled={!isEditing} />
        </div>
      </CardContent>
    </Card>
  );
}

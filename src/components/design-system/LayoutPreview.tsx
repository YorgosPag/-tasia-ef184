'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, Building } from 'lucide-react';
import type { LayoutSettings } from './LayoutCustomizer';

interface LayoutPreviewProps {
  settings: LayoutSettings;
}

export function LayoutPreview({ settings }: LayoutPreviewProps) {
  const previewStyle: React.CSSProperties = {
    marginBottom: `${settings.margin}px`,
    borderRadius: `8px`, // Assuming a default card radius for preview
    borderWidth: `${settings.borderWidth}px`,
    borderColor: 'hsl(var(--border))',
    boxShadow: `0 10px 15px -3px rgba(0, 0, 0, ${settings.shadow / 100}), 0 4px 6px -2px rgba(0, 0, 0, ${settings.shadow / 200})`,
    transition: 'all 0.2s ease-in-out',
  };

  const codeSnippet = `
.custom-container {
  margin-bottom: ${settings.margin}px;
  border-width: ${settings.borderWidth}px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, ${settings.shadow / 100});
}
  `.trim();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="w-5 h-5" />
            Ζωντανή Προεπισκόπηση
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div
              className="bg-card w-full max-w-md border"
              style={previewStyle}
            >
              <div className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Δείγμα Κάρτας 1</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Αυτό είναι ένα παράδειγμα του πώς θα εφαρμόζονται οι ρυθμίσεις διάταξης.
                  </p>
                </div>
              </div>
            </div>
             <div
              className="bg-card w-full max-w-md border"
              style={previewStyle}
            >
              <div className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Δείγμα Κάρτας 2</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Το κενό μεταξύ των καρτών ελέγχεται από το &quot;Κενό μεταξύ ενοτήτων&quot;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Παραγόμενο CSS</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted/50 dark:bg-muted/20 p-4 rounded-md text-xs font-mono overflow-x-auto">
            <code>
              {codeSnippet}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

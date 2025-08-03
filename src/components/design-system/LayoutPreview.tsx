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
    margin: `${settings.margin}px`,
    padding: `${settings.padding}px`,
    borderRadius: `${settings.borderRadius}px`,
    borderWidth: `${settings.borderWidth}px`,
    borderColor: 'hsl(var(--border))',
    boxShadow: `0 10px 15px -3px rgba(0, 0, 0, ${settings.shadow / 100}), 0 4px 6px -2px rgba(0, 0, 0, ${settings.shadow / 200})`,
    transition: 'all 0.2s ease-in-out',
  };

  const codeSnippet = `
.custom-container {
  padding: ${settings.padding}px;
  margin: ${settings.margin}px;
  border-radius: ${settings.borderRadius}px;
  border: ${settings.borderWidth}px solid hsl(var(--border));
  box-shadow: 0 10px 15px -3px rgba(0,0,0, ${settings.shadow / 100});
}
  `.trim();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="w-5 h-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
            <div
              className="bg-card w-full max-w-md"
              style={previewStyle}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Sample Container</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This is an example of how your layout settings will be applied to a container element.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generated CSS</CardTitle>
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

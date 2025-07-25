
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen -m-8 bg-background">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="mt-4">Κάτι πήγε στραβά!</CardTitle>
                <CardDescription>
                    Προέκυψε ένα μη αναμενόμενο σφάλμα. Παρακαλώ προσπαθήστε ξανά.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Αν το πρόβλημα επιμένει, μπορείτε να δοκιμάσετε να ανανεώσετε τη σελίδα ή να επικοινωνήσετε με την υποστήριξη.
                </p>
                <pre className="mt-4 text-xs text-left bg-muted p-2 rounded-md overflow-x-auto">
                    {error.message}
                </pre>
                <Button
                    onClick={() => reset()}
                    className="mt-6"
                >
                    Προσπαθήστε ξανά
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}


'use client';

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Καλώς ήρθατε</CardTitle>
          <CardDescription>
            Συνδεθείτε στον λογαριασμό σας για να συνεχίσετε.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

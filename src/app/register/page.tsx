
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';


const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Function to create a user document in Firestore
const createUserDocument = async (user: User) => {
  if (!user) return;
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  // Create user document only if it doesn't exist
  if (!userDoc.exists()) {
    // Check if this is the very first user *before* creating the document
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, limit(1));
    const snapshot = await getDocs(q);
    const isFirstUser = snapshot.empty;
    const role = isFirstUser ? 'admin' : 'viewer';
    
    const { email, photoURL, displayName } = user;
    try {
      await setDoc(userDocRef, {
        email,
        photoURL,
        displayName,
        role: role, // Assign role dynamically
        createdAt: serverTimestamp(),
      });
       if(isFirstUser) {
        console.log(`First user registered with email ${email}. Assigning admin role.`);
      }
    } catch (error) {
      console.error("🔥 Firestore user creation error:", error);
    }
  }
};


export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   // Handle redirect result from Google Sign-In
   useEffect(() => {
    const checkRedirectResult = async () => {
      setIsGoogleLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await createUserDocument(result.user);
          router.push('/');
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Google Sign-Up Failed",
          description: error.message,
        });
      } finally {
        setIsGoogleLoading(false);
      }
    };
    checkRedirectResult();
  }, [router, toast]);


  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await createUserDocument(userCredential.user);
      await sendEmailVerification(userCredential.user);

      toast({
        title: "Registration Successful",
        description: "Ένα email επιβεβαίωσης στάλθηκε. Ελέγξτε τα εισερχόμενά σας.",
        duration: 5000,
      });

      router.push('/');

    } catch (error: any) {
      console.error("Registration Error:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email address is already in use.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        await createUserDocument(result.user);
        router.push('/');
      }
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
          toast({
            variant: "destructive",
            title: "Google Sign-Up Failed",
            description: error.message,
          });
      }
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen -m-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} disabled={isLoading || isGoogleLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading || isGoogleLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </Form>
        <div className="relative px-6 pb-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-muted-foreground">OR</span>
        </div>
        <CardFooter className="flex-col gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                 {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.4 54.7l-73.4 67.9C294.5 98.4 271.8 88 248 88c-79.3 0-144.1 61.4-144.1 137.2s64.8 137.2 144.1 137.2c87.3 0 121.3-63.4 125.7-93.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
                  </svg>
                )}
                Sign up with Google
            </Button>
            <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Login
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

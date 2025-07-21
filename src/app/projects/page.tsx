
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const projectSchema = z.object({
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  description: z.string().optional(),
  status: z.enum(['Ενεργό', 'Σε εξέλιξη', 'Ολοκληρωμένο']),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Project extends ProjectFormValues {
  id: string;
  createdAt: any;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Ενεργό',
    },
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData: Project[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Project));
      setProjects(projectsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η φόρτωση των έργων.",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Επιτυχία",
        description: "Το έργο προστέθηκε με επιτυχία.",
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding project: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η προσθήκη του έργου.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ολοκληρωμένο':
        return 'default';
      case 'Σε εξέλιξη':
        return 'secondary';
      case 'Ενεργό':
        return 'outline';
      default:
        return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Έργα
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Νέο Έργο
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Δημιουργία Νέου Έργου</DialogTitle>
              <DialogDescription>
                Συμπληρώστε τις παρακάτω πληροφορίες για να δημιουργήσετε ένα νέο έργο.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Όνομα Έργου</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. Ανακαίνιση Κτιρίου" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Περιγραφή</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Περιγράψτε το έργο..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Κατάσταση</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε κατάσταση" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ενεργό">Ενεργό</SelectItem>
                          <SelectItem value="Σε εξέλιξη">Σε εξέλιξη</SelectItem>
                          <SelectItem value="Ολοκληρωμένο">Ολοκληρωμένο</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Ακύρωση
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Δημιουργία
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Έργων</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Όνομα</TableHead>
                  <TableHead>Περιγραφή</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">{project.description}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν έργα.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

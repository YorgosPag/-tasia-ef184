
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2, CalendarIcon, Edit, Trash2, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { useDataStore, Project } from '@/hooks/use-data-store';
import { logActivity } from '@/lib/logger';
import { exportToJson } from '@/lib/exporter';


const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Ο τίτλος είναι υποχρεωτικός." }),
  companyId: z.string().min(1, { message: "Η εταιρεία είναι υποχρεωτική." }),
  location: z.string().min(1, { message: "Η τοποθεσία είναι υποχρεωτική." }),
  description: z.string().optional(),
  deadline: z.date({
    required_error: "Η προθεσμία είναι υποχρεωτική.",
  }),
  status: z.enum(['Ενεργό', 'Σε εξέλιξη', 'Ολοκληρωμένο']),
  photoUrl: z.string().url({ message: "Το URL δεν είναι έγκυρο." }).or(z.literal("")).optional(),
  tags: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const { projects, companies, isLoading, addProject } = useDataStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: undefined,
      title: '',
      companyId: '',
      location: '',
      description: '',
      status: 'Ενεργό',
      photoUrl: '',
      tags: '',
    },
  });

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setEditingProject(null);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    form.reset({
      ...project,
      tags: project.tags?.join(', ') || '',
      deadline: project.deadline instanceof Timestamp ? project.deadline.toDate() : project.deadline,
    });
    setIsDialogOpen(true);
  };
  
  const handleDuplicateProject = async (projectId: string) => {
    const projectToClone = projects.find(p => p.id === projectId);
    if (!projectToClone) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε το έργο προς αντιγραφή.' });
        return;
    }
    try {
        const { id, createdAt, ...clonedData } = projectToClone;
        clonedData.title = `${clonedData.title} (Copy)`;
        const newId = await addProject({
            ...clonedData,
            tags: clonedData.tags?.join(','),
            deadline: clonedData.deadline instanceof Timestamp ? clonedData.deadline.toDate() : clonedData.deadline,
        });
        toast({ title: 'Επιτυχία', description: `Το έργο '${projectToClone.title}' αντιγράφηκε.` });
        if (newId) {
            await logActivity('DUPLICATE_PROJECT', {
                entityId: newId,
                entityType: 'project',
                sourceEntityId: projectId,
                name: clonedData.title,
            });
        }
    } catch (error) {
        console.error('Error duplicating project:', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η αντιγραφή απέτυχε.' });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
      try {
        const projectToDelete = projects.find(p => p.id === projectId);
        await deleteDoc(doc(db, 'projects', projectId));
        // Note: This simple delete doesn't cascade to subcollections.
        // A more robust solution would use a Cloud Function to clean up sub-collections.
        toast({ title: "Επιτυχία", description: "Το έργο διαγράφηκε." });

        if (projectToDelete) {
            await logActivity('DELETE_PROJECT', { 
                entityId: projectId, 
                entityType: 'project',
                title: projectToDelete.title 
            });
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν ήταν δυνατή η διαγραφή του έργου." });
      }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        // Update logic
        const projectRef = doc(db, 'projects', editingProject.id);
        const { id, ...formData } = data;
        const updateData = {
            ...formData,
            photoUrl: formData.photoUrl?.trim() || undefined,
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            deadline: Timestamp.fromDate(formData.deadline),
        };
        await updateDoc(projectRef, updateData);
        toast({ title: "Επιτυχία", description: "Το έργο ενημερώθηκε." });
        await logActivity('UPDATE_PROJECT', { 
            entityId: editingProject.id, 
            entityType: 'project',
            title: updateData.title,
            changes: updateData 
        });
      } else {
        // Create logic
        const newProjectId = await addProject(data);
        toast({ title: "Επιτυχία", description: "Το έργο προστέθηκε." });
        if(newProjectId) {
            await logActivity('CREATE_PROJECT', { 
                entityId: newProjectId, 
                entityType: 'project',
                title: data.title 
            });
        }
      }
      handleDialogOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting project: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Δεν ήταν δυνατή η υποβολή: ${error.message}`,
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
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Ολοκληρωμένο": return "✅ Ολοκληρωμένο";
      case "Σε εξέλιξη": return "🚧 Σε εξέλιξη";
      case "Ενεργό": return "🔥 Ενεργό";
      default: return status;
    }
  }

  const formatDate = (timestamp: Timestamp | Date | undefined) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return format(date, 'dd/MM/yyyy', { locale: el });
  };
  
  const handleRowClick = (e: React.MouseEvent, projectId: string) => {
    // Prevent row click when clicking on action buttons
    if ((e.target as HTMLElement).closest('[data-action-button]')) {
      return;
    }
    router.push(`/projects/${projectId}`);
  };

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || companyId;
  };

  const handleExport = () => {
    const dataToExport = projects.map(p => ({
      ...p,
      companyName: getCompanyName(p.companyId),
      deadline: formatDate(p.deadline),
      createdAt: formatDate(p.createdAt),
    }));
    exportToJson(dataToExport, 'projects');
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Έργα
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" disabled={isLoading || projects.length === 0}>
                <Download className="mr-2"/>
                Εξαγωγή σε JSON
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2" />
                Νέο Έργο
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                <DialogTitle>{editingProject ? 'Επεξεργασία' : 'Δημιουργία Νέου'} Έργου</DialogTitle>
                <DialogDescription>
                    {editingProject ? 'Ενημερώστε τις πληροφορίες του έργου.' : 'Συμπληρώστε τις παρακάτω πληροφορίες για να δημιουργήσετε ένα νέο έργο.'}
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Τίτλος Έργου</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. Ανακαίνιση Κτιρίου" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Εταιρεία</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Επιλέξτε εταιρεία..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
                                    ) : (
                                        companies.map(company => (
                                            <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Τοποθεσία</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. Αμπελόκηποι, Αθήνα" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL Φωτογραφίας (Προαιρετικό)</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/project.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tags (χωρισμένα με κόμμα)</FormLabel>
                        <FormControl>
                            <Input placeholder="π.χ. residential, luxury" {...field} />
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
                        <FormLabel>Περιγραφή (Προαιρετικό)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Σύντομη περιγραφή του έργου..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Προθεσμία</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP", { locale: el })
                                ) : (
                                    <span>Επιλέξτε ημερομηνία</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0))
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
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
                    <Button type="submit" disabled={isSubmitting || isLoading}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingProject ? 'Αποθήκευση' : 'Δημιουργία'}
                    </Button>
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
            </Dialog>
        </div>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Τίτλος</TableHead>
                    <TableHead>Εταιρεία</TableHead>
                    <TableHead>Τοποθεσία</TableHead>
                    <TableHead>Προθεσμία</TableHead>
                    <TableHead>Κατάσταση</TableHead>
                    <TableHead className="text-right">Ενέργειες</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} onClick={(e) => handleRowClick(e, project.id)} className="cursor-pointer group">
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="text-muted-foreground">{getCompanyName(project.companyId)}</TableCell>
                      <TableCell className="text-muted-foreground">{project.location}</TableCell>
                      <TableCell>{formatDate(project.deadline)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-right">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1" data-action-button>
                              <Button variant="ghost" size="icon" title="Αντιγραφή" onClick={() => handleDuplicateProject(project.id)}>
                                  <Copy className="h-4 w-4" />
                                  <span className="sr-only">Αντιγραφή</span>
                              </Button>
                              <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={() => handleEditClick(project)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Επεξεργασία</span>
                              </Button>
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" title="Διαγραφή" className="text-destructive hover:text-destructive">
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Διαγραφή</span>
                                      </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                          <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                                          <AlertDialogDescription>
                                              Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το έργο "{project.title}".
                                          </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                          <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)} className="bg-destructive hover:bg-destructive/90">
                                              Διαγραφή
                                          </AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν έργα.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

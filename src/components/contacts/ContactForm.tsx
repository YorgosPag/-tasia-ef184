

'use client';

import React from 'react';
import { useWatch, useFieldArray } from 'react-hook-form';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { BasicInfoSection } from './ContactForm/sections/BasicInfoSection';
import { IdentitySection } from './ContactForm/sections/IdentitySection';
import { ContactSection } from './ContactForm/sections/ContactSection';
import { AddressSection } from './ContactForm/sections/AddressSection';
import { JobSection } from './ContactForm/sections/JobSection';
import { NotesSection } from './ContactForm/sections/NotesSection';
import { type ContactFormProps } from './ContactForm/types';
import { SocialsSection } from './ContactForm/sections/SocialsSection';
import { LegalRepresentativeSection } from './ContactForm/sections/LegalRepresentativeSection';
import { FormItem, FormLabel, FormControl, FormField, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Phone, Link as LinkIcon, Map as MapIcon, Info, UserCircle } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';


export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const entityType = useWatch({ control: form.control, name: 'entityType' });
  const statuses = useWatch({ control: form.control, name: 'job.statuses' }) || [];
  const branches = useWatch({ control: form.control, name: 'job.branches' }) || [];
  const companyVersions = useWatch({ control: form.control, name: 'job.companyVersions' }) || [];
  const docSummary = useWatch({ control: form.control, name: 'job.docSummary' }) || [];
  const externalLinks = useWatch({ control: form.control, name: 'job.externalLinks' }) || [];
  const registrationType = useWatch({ control: form.control, name: 'job.registrationType' });
  const branchType = useWatch({ control: form.control, name: 'job.branchType' });
  
  const { fields: addressFields } = useFieldArray({
    control: form.control,
    name: "addresses",
    keyName: 'fieldId', 
  });
  
  const addresses = useWatch({ control: form.control, name: 'addresses' }) || [];
  const gemhAddressIndex = addresses.findIndex(addr => addr.fromGEMI);
  
  const renderLegalPersonForm = () => (
     <div className="w-full space-y-4">
        <Accordion type="multiple" defaultValue={['personal']} className="w-full">
            <BasicInfoSection form={form} onFileSelect={onFileSelect} />
        </Accordion>
        
        <Tabs defaultValue="gemh-data" className="w-full">
            <TabsList className="h-auto flex-wrap justify-start">
                <TabsTrigger value="gemh-data">Στοιχεία από ΓΕΜΗ</TabsTrigger>
                <TabsTrigger value="user-data">Στοιχεία από Χρήστη</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gemh-data" className="mt-4">
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="flex flex-wrap gap-2 w-full justify-start h-auto">
                        <TabsTrigger value="general">Γενικά Στοιχεία</TabsTrigger>
                        <TabsTrigger value="registration">Καταχώριση στο ΓΕΜΗ</TabsTrigger>
                        <TabsTrigger value="enriched">Εμπλουτισμένα Στοιχεία</TabsTrigger>
                        <TabsTrigger value="headquarters">Διεύθυνση Έδρας (ΓΕΜΗ)</TabsTrigger>
                        <TabsTrigger value="branches">Καταστήματα / Υποκαταστήματα</TabsTrigger>
                        <TabsTrigger value="objective">Σκοπός & Αντικείμενο</TabsTrigger>
                        <TabsTrigger value="statuses">Καταστάσεις ΓΕΜΗ</TabsTrigger>
                        <TabsTrigger value="capital">Κεφάλαιο Εταιρείας</TabsTrigger>
                        <TabsTrigger value="stocks">Μετοχική Σύνθεση</TabsTrigger>
                        <TabsTrigger value="documents">Έγγραφα ΓΕΜΗ</TabsTrigger>
                        <TabsTrigger value="docSummary">Σύνοψη Εγγράφων ΓΕΜΗ</TabsTrigger>
                        <TabsTrigger value="activities">Δραστηριότητες (ΚΑΔ)</TabsTrigger>
                        <TabsTrigger value="decisions">Αποφάσεις Οργάνων</TabsTrigger>
                        <TabsTrigger value="establishment">Στοιχεία Σύστασης (ΥΜΣ)</TabsTrigger>
                        <TabsTrigger value="representatives">Εκπρόσωποι από ΓΕΜΗ</TabsTrigger>
                        <TabsTrigger value="versions">Ιστορικό Εκδόσεων Εταιρείας</TabsTrigger>
                        <TabsTrigger value="externalLinks">Σύνδεσμοι Τρίτων Φορέων</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="mt-4">
                        <Accordion type="single" collapsible defaultValue="job" className="w-full space-y-2">
                             <JobSection form={form} />
                        </Accordion>
                    </TabsContent>
                    
                    <TabsContent value="registration" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Στοιχεία Καταχώρισης</CardTitle>
                                <CardDescription>🛈 Οι παρακάτω πληροφορίες αφορούν την αρχική εγγραφή της εταιρείας στο Γ.Ε.ΜΗ.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <FormField name="job.initialRegistrationDate" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ημερομηνία Πρώτης Καταχώρισης</FormLabel>
                                        <FormControl>
                                            <Input value={field.value || "—"} disabled />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                                <div className="flex gap-4">
                                  <div>
                                    <FormLabel>Τρόπος Εγγραφής</FormLabel>
                                    <Badge variant="outline" className="block w-fit mt-2">{registrationType || "—"}</Badge>
                                  </div>
                                  <div>
                                    <FormLabel>Υποκατάστημα / Μητρική</FormLabel>
                                    <Badge variant="outline" className="block w-fit mt-2">{branchType || "—"}</Badge>
                                  </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="enriched" className="mt-4">
                        <Card className="relative border-muted">
                            <CardContent className="p-6 space-y-4">
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                🛈 Τα παρακάτω στοιχεία θα συμπληρωθούν αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                    <FormItem><FormLabel>Επωνυμία (Αγγλικά)</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Διακριτικός Τίτλος (Αγγλικά)</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Ιστοσελίδα</FormLabel><FormControl><Input disabled placeholder="—" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Email Επιχείρησης</FormLabel><FormControl><Input disabled placeholder="—" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Ημερομηνία Σύστασης</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                     <TabsContent value="headquarters" className="mt-4">
                        {gemhAddressIndex !== -1 && addressFields[gemhAddressIndex] ? (
                             <Card key={JSON.stringify(addresses[gemhAddressIndex])} className="relative border-destructive/50">
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-sm text-destructive font-semibold text-center mb-4">
                                       ❗ Τα παρακάτω στοιχεία αντλήθηκαν αυτόματα από το Γ.Ε.ΜΗ. και δεν μπορούν να τροποποιηθούν από εδώ.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField name={`addresses.${gemhAddressIndex}.street`} control={form.control} render={({field}) => (<FormItem><FormLabel>Οδός</FormLabel><FormControl><Input {...field} disabled /></FormControl></FormItem>)}/>
                                        <FormField name={`addresses.${gemhAddressIndex}.number`} control={form.control} render={({field}) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
                                        <FormField name={`addresses.${gemhAddressIndex}.postalCode`} control={form.control} render={({field}) => (<FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
                                        <FormField name={`addresses.${gemhAddressIndex}.municipality`} control={form.control} render={({field}) => (<FormItem><FormLabel>Δήμος/Πόλη</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
                                        <FormField name={`addresses.${gemhAddressIndex}.poBox`} control={form.control} render={({field}) => (<FormItem><FormLabel>Ταχυδρομική Θυρίδα</FormLabel><FormControl><Input {...field} disabled placeholder="-"/></FormControl></FormItem>)}/>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                           <Card className="relative border-muted">
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-sm text-muted-foreground text-center mb-4">
                                    🔄 Αναμένουμε στοιχεία από το Γ.Ε.ΜΗ. Τα πεδία θα συμπληρωθούν αυτόματα μόλις συνδεθεί η υπηρεσία.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                    <FormItem><FormLabel>Οδός</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Δήμος/Πόλη</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Ταχυδρομική Θυρίδα</FormLabel><FormControl><Input disabled placeholder="-"/></FormControl></FormItem>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                     <TabsContent value="branches" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Καταστήματα / Υποκαταστήματα</CardTitle>
                                <CardDescription>🛈 Τα παρακάτω στοιχεία αντλούνται από το Γ.Ε.ΜΗ. και θα συμπληρωθούν αυτόματα μόλις ολοκληρωθεί η σύνδεση.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {branches?.length > 0 ? (
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Οδός</TableHead><TableHead>Αρ.</TableHead><TableHead>Τ.Κ.</TableHead><TableHead>Δήμος</TableHead><TableHead>Κατάσταση</TableHead><TableHead>Ημ/νία Σύστασης</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {branches.map((b: any, idx: number) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{b.address || "—"}</TableCell>
                                                    <TableCell>{b.number || "—"}</TableCell>
                                                    <TableCell>{b.postalCode || "—"}</TableCell>
                                                    <TableCell>{b.municipality || "—"}</TableCell>
                                                    <TableCell>{b.status || "—"}</TableCell>
                                                    <TableCell>{b.established || "—"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-6">Δεν βρέθηκαν υποκαταστήματα.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="objective" className="mt-4">
                        <Card className="relative border-muted">
                            <CardContent className="p-6 space-y-4">
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                  🛈 Ο σκοπός της εταιρείας, όπως έχει δηλωθεί στο Γ.Ε.ΜΗ.
                                </p>
                                <FormField
                                  name="job.objective"
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Σκοπός Εταιρείας</FormLabel>
                                      <FormControl>
                                        <Textarea {...field} disabled placeholder="—" className="min-h-[120px]" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                     <TabsContent value="statuses" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Ιστορικό Καταστάσεων ΓΕΜΗ</CardTitle>
                                <CardDescription>
                                    🛈 Οι καταστάσεις της εταιρείας όπως καταγράφονται στο Γ.Ε.ΜΗ.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {statuses?.length > 0 ? (
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Κατάσταση</TableHead><TableHead>Ημερομηνία</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {statuses.map((item: any, idx: number) => (
                                                <TableRow key={idx}><TableCell>{item.status || "—"}</TableCell><TableCell>{item.statusDate || "—"}</TableCell></TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-6">Δεν βρέθηκαν διαθέσιμες καταστάσεις.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="capital" className="mt-4">
                        <Card className="relative border-muted">
                            <CardContent className="p-6 space-y-4">
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                🛈 Τα παρακάτω στοιχεία θα συμπληρωθούν αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                    <FormItem><FormLabel>Κεφάλαιο</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Νόμισμα</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Εξωλογιστικά Κεφάλαια</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Εγγυητικά Κεφάλαια</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="stocks" className="mt-4">
                        <Card className="relative border-muted">
                             <CardHeader>
                                <CardTitle className="text-lg">Μετοχική Σύνθεση</CardTitle>
                                <CardDescription>
                                    🛈 Τα στοιχεία της μετοχικής σύνθεσης θα συμπληρωθούν αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
                                    <FormItem><FormLabel>Τύπος Μετοχής</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Ποσότητα</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                    <FormItem><FormLabel>Ονομαστική Τιμή</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="documents" className="mt-4">
                        <Card className="relative border-muted">
                             <CardHeader>
                                <CardTitle className="text-lg">Έγγραφα ΓΕΜΗ</CardTitle>
                                <CardDescription>
                                    Τα παρακάτω έγγραφα θα αντλούνται αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Έγγραφα Ανακοινώσεων (Αποφάσεις Οργάνων)</h4>
                                    <div className="overflow-x-auto border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Ημ/νία</TableHead>
                                                    <TableHead>Όργανο</TableHead>
                                                    <TableHead>Θέμα</TableHead>
                                                    <TableHead>KAK</TableHead>
                                                    <TableHead>Ενέργεια</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="opacity-50">
                                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                    <TableCell><Button variant="outline" size="sm" disabled>Λήψη</Button></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Έγγραφα Σύστασης (ΥΜΣ)</h4>
                                     <div className="overflow-x-auto border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Κωδικός (ΚΑΔ)</TableHead>
                                                    <TableHead>Ενέργεια</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="opacity-50">
                                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                    <TableCell><Button variant="outline" size="sm" disabled>Λήψη</Button></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="docSummary" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Σύνοψη Εγγράφων ΓΕΜΗ</CardTitle>
                                <CardDescription>
                                    🛈 Τα παρακάτω έγγραφα αντλούνται από το Γ.Ε.ΜΗ. και δεν είναι επεξεργάσιμα.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {docSummary?.length > 0 ? (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Τύπος</TableHead><TableHead>Ημ/νία</TableHead><TableHead>Θέμα</TableHead><TableHead>Λήψη</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {docSummary.map((doc: any, idx: number) => (
                                            <TableRow key={idx}>
                                            <TableCell>{doc.type || "—"}</TableCell>
                                            <TableCell>{doc.date || "—"}</TableCell>
                                            <TableCell>{doc.subject || "—"}</TableCell>
                                            <TableCell>
                                                {doc.url ? (<Button asChild variant="link" size="sm"><a href={doc.url} target="_blank" rel="noopener noreferrer">Λήψη</a></Button>) : ("—")}
                                            </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                ) : (
                                <p className="text-sm text-muted-foreground text-center py-6">
                                    Δεν βρέθηκαν σχετικά έγγραφα.
                                </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                     <TabsContent value="activities" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Δραστηριότητες (ΚΑΔ)</CardTitle>
                                <CardDescription>
                                    🛈 Τα παρακάτω στοιχεία αντλούνται από το Γ.Ε.ΜΗ. και θα συμπληρωθούν αυτόματα μόλις ολοκληρωθεί η σύνδεση.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto border rounded-md opacity-50">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Κωδικός ΚΑΔ</TableHead>
                                                <TableHead>Περιγραφή</TableHead>
                                                <TableHead>Τύπος</TableHead>
                                                <TableHead>Από</TableHead>
                                                <TableHead>Έως</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="decisions" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Αποφάσεις Οργάνων</CardTitle>
                                <CardDescription>
                                     🛈 Οι αποφάσεις οργάνων θα εμφανίζονται αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto border rounded-md opacity-50">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ημ/νία Απόφασης</TableHead>
                                                <TableHead>Όργανο</TableHead>
                                                <TableHead>Θέμα</TableHead>
                                                <TableHead>ΚΑΚ</TableHead>
                                                <TableHead>Αρχείο</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                                <TableCell><Button variant="outline" size="sm" disabled>Λήψη</Button></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="establishment" className="mt-4">
                      <Card className="relative border-muted">
                        <CardHeader>
                          <CardTitle className="text-lg">Στοιχεία Σύστασης (ΥΜΣ)</CardTitle>
                          <CardDescription>
                            🛈 Τα στοιχεία της σύστασης θα εμφανιστούν αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση με την ΥΜΣ.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto border rounded-md opacity-50">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Κωδικός Δημοσίευσης (ΚΑΔ)</TableHead>
                                  <TableHead>Σύνδεσμος Εγγράφου</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                  <TableCell><Button variant="outline" size="sm" disabled>Λήψη</Button></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="versions" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Ιστορικό Εκδόσεων Εταιρείας</CardTitle>
                                <CardDescription>
                                    🛈 Οι εκδόσεις (τροποποιήσεις) της εταιρείας όπως καταγράφονται στο Γ.Ε.ΜΗ.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {companyVersions?.length > 0 ? (
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Ημερομηνία Έκδοσης</TableHead><TableHead>Περιγραφή</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {companyVersions.map((item: any, idx: number) => (
                                                <TableRow key={idx}><TableCell>{item.versionDate || "—"}</TableCell><TableCell>{item.description || "—"}</TableCell></TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-6">Δεν βρέθηκαν εκδόσεις εταιρείας.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="representatives" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="representative" className="w-full">
                            <LegalRepresentativeSection form={form} />
                        </Accordion>
                    </TabsContent>

                    <TabsContent value="externalLinks" className="mt-4">
                        <Card className="relative border-muted">
                            <CardHeader>
                                <CardTitle className="text-lg">Σύνδεσμοι Τρίτων Φορέων</CardTitle>
                                <CardDescription>🛈 Σύνδεσμοι προς εξωτερικές υπηρεσίες που αφορούν την επιχείρηση.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {externalLinks?.length > 0 ? (
                                    <div className="space-y-2">
                                        {externalLinks.map((link: any, idx: number) => (
                                            <div key={idx} className="flex items-center">
                                                <Button asChild variant="link" className="p-0 h-auto">
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                        {link.label}
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm text-center py-4">Δεν υπάρχουν διαθέσιμοι σύνδεσμοι.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </TabsContent>

            <TabsContent value="user-data" className="mt-4">
                 <Tabs defaultValue="contact" className="w-full">
                     <TabsList className="flex h-auto flex-wrap justify-start gap-1">
                         <TabsTrigger value="contact">Επικοινωνία & Socials</TabsTrigger>
                         <TabsTrigger value="addresses">Διευθύνσεις</TabsTrigger>
                         <TabsTrigger value="notes">Σημειώσεις</TabsTrigger>
                     </TabsList>
                      <TabsContent value="contact" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="contact" className="w-full">
                              <AccordionItem value="contact">
                                 <AccordionTrigger>
                                     <div className="flex items-center gap-2 text-primary">
                                         <Phone className="h-5 w-5" />
                                         <span>Επικοινωνία & Socials</span>
                                     </div>
                                 </AccordionTrigger>
                                 <AccordionContent className="p-1">
                                     <ContactSection form={form} />
                                     <SocialsSection form={form} />
                                 </AccordionContent>
                             </AccordionItem>
                         </Accordion>
                     </TabsContent>
                      <TabsContent value="addresses" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="addresses" className="w-full">
                              <AccordionItem value="addresses">
                                 <AccordionTrigger>
                                     <div className="flex items-center gap-2 text-primary">
                                         <MapIcon className="h-5 w-5" />
                                         <span>Διευθύνσεις</span>
                                     </div>
                                 </AccordionTrigger>
                                 <AccordionContent className="p-1">
                                     <AddressSection form={form} />
                                 </AccordionContent>
                             </AccordionItem>
                         </Accordion>
                     </TabsContent>
                      <TabsContent value="notes" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="notes" className="w-full">
                             <AccordionItem value="notes">
                                 <AccordionTrigger>
                                     <div className="flex items-center gap-2 text-primary">
                                         <Info className="h-5 w-5" />
                                         <span>Σημειώσεις</span>
                                     </div>
                                 </AccordionTrigger>
                                 <AccordionContent className="p-1">
                                     <NotesSection form={form} />
                                 </AccordionContent>
                             </AccordionItem>
                         </Accordion>
                     </TabsContent>
                 </Tabs>
            </TabsContent>
        </Tabs>
    </div>
  );

  const renderDefaultForm = () => (
     <Accordion type="multiple" value={openSections} onValueChange={onOpenChange} className="w-full">
      <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      <IdentitySection form={form} />
      <AccordionItem value="contact">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <Phone className="h-5 w-5" />
                    <span>Επικοινωνία & Socials</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <ContactSection form={form} />
                <SocialsSection form={form} />
            </AccordionContent>
      </AccordionItem>
      <AccordionItem value="addresses">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <MapIcon className="h-5 w-5" />
                    <span>Διευθύνσεις</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <AddressSection form={form} />
            </AccordionContent>
      </AccordionItem>
      <JobSection form={form} />
      <AccordionItem value="notes">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <Info className="h-5 w-5" />
                    <span>Σημειώσεις</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <NotesSection form={form} />
            </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (entityType === 'Νομικό Πρόσωπο') ? renderLegalPersonForm() : renderDefaultForm();
}

    

'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import { UnitDetailsForm } from './UnitDetailsForm';
import type { NewUnitFormValues as UnitFormValues } from '@/lib/unit-helpers';
import { AttachmentDialog, AttachmentFormValues } from '@/components/units/AttachmentDialog';
import { UnitsListTable } from '@/components/units/UnitsListTable';
import { Unit } from '@/hooks/use-unit-details';
import { UnitContactForm } from './UnitContactForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnitFloorPlansTab } from './tabs/UnitFloorPlansTab';
import { UnitPhotosTab } from './tabs/UnitPhotosTab';
import dynamic from 'next/dynamic';

const UnitContractsTab = dynamic(() => import('./tabs/UnitContractsTab'), {
  loading: () => <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin"/></div>,
  ssr: false,
});


interface UnitDetailsPageViewProps {
  unit: Unit;
  attachments: AttachmentFormValues[];
  unitForm: UseFormReturn<UnitFormValues>;
  attachmentForm: UseFormReturn<AttachmentFormValues>;
  isSubmitting: boolean;
  isAttachmentDialogOpen: boolean;
  editingAttachment: AttachmentFormValues | null;
  onUnitSubmit: (e: React.FormEvent) => void;
  onSubmitAttachment: (e: React.FormEvent) => void;
  handleAttachmentDialogChange: (open: boolean) => void;
  handleAddNewAttachment: () => void;
  handleEditAttachment: (attachment: AttachmentFormValues) => void;
  handleDeleteAttachment: (attachmentId: string) => void;
  goBack: () => void;
  getStatusClass: (status: Unit['status'] | undefined) => string;
}

export function UnitDetailsPageView({
  unit,
  attachments,
  unitForm,
  attachmentForm,
  isSubmitting,
  isAttachmentDialogOpen,
  editingAttachment,
  onUnitSubmit,
  onSubmitAttachment,
  handleAttachmentDialogChange,
  handleAddNewAttachment,
  handleEditAttachment,
  handleDeleteAttachment,
  goBack,
  getStatusClass,
}: UnitDetailsPageViewProps) {
  const { isDirty } = unitForm.formState;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" className="w-fit" type="button" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή
        </Button>
        <Button type="submit" form="unit-details-form" disabled={isSubmitting || !isDirty}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Αποθήκευση Ακινήτου
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Γενικά</TabsTrigger>
          <TabsTrigger value="floor-plans">Κατόψεις</TabsTrigger>
          <TabsTrigger value="contracts">Συμβόλαια</TabsTrigger>
          <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <div className="flex flex-col gap-8">
            <Form {...unitForm}>
              <form id="unit-details-form" onSubmit={onUnitSubmit}>
                 <UnitDetailsForm
                    form={unitForm}
                    unit={unit}
                    getStatusClass={getStatusClass}
                  />
              </form>
            </Form>

            <UnitContactForm unitName={unit.name} />

            <Card>
              <CardContent className="pt-6">
                 <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Παρακολουθήματα</h3>
                  <Button type="button" size="sm" variant="outline" onClick={handleAddNewAttachment}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Προσθήκη
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Διαχειριστείτε τις θέσεις στάθμευσης, αποθήκες κ.λπ. που συνδέονται με αυτό το ακίνητο.
                </p>
                <UnitsListTable
                  units={attachments.map(a => ({...a, id: a.id!}))}
                  onEditUnit={handleEditAttachment}
                  onDeleteUnit={handleDeleteAttachment}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="floor-plans" className="mt-4">
          <UnitFloorPlansTab unit={unit} />
        </TabsContent>

        <TabsContent value="contracts" className="mt-4">
          <UnitContractsTab unit={unit} />
        </TabsContent>
        
        <TabsContent value="photos" className="mt-4">
          <UnitPhotosTab unit={unit} />
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
           <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Η διαχείριση βίντεο θα είναι διαθέσιμη σύντομα.</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <AttachmentDialog
        open={isAttachmentDialogOpen}
        onOpenChange={handleAttachmentDialogChange}
        form={attachmentForm}
        onSubmit={onSubmitAttachment}
        isSubmitting={isSubmitting}
        editingAttachment={editingAttachment}
      />
    </div>
  );
}

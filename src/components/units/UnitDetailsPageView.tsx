
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import { UnitDetailsForm, UnitFormValues } from './UnitDetailsForm';
import { AttachmentDialog, AttachmentFormValues } from './AttachmentDialog';
import { UnitsListTable } from '@/components/floors/UnitsListTable';
import { Unit } from '@/hooks/use-unit-details';
import { UnitContactForm } from './UnitContactForm';

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
      <Form {...unitForm}>
        <form onSubmit={onUnitSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="w-fit" type="button" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Επιστροφή
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Αποθήκευση Ακινήτου
              </Button>
            </div>

            <UnitDetailsForm
              form={unitForm}
              unit={unit}
              getStatusClass={getStatusClass}
            />
          </div>
        </form>
      </Form>

      <UnitContactForm unitName={unit.name} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Παρακολουθήματα</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={handleAddNewAttachment}>
              <PlusCircle className="mr-2" />
              Προσθήκη
            </Button>
          </div>
          <CardDescription>
            Διαχειριστείτε τις θέσεις στάθμευσης, αποθήκες κ.λπ. που συνδέονται με αυτό το ακίνητο.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UnitsListTable
            units={attachments}
            onEditUnit={handleEditAttachment}
            onDeleteUnit={handleDeleteAttachment}
          />
        </CardContent>
      </Card>

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

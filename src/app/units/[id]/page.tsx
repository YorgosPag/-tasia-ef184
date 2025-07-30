
'use client';
import { Loader2 } from 'lucide-react';
import { useUnitDetails } from '@/shared/hooks/use-unit-details';
import { UnitDetailsPageView } from '@/components/units/UnitDetailsPageView';

export default function UnitDetailsPage() {
  const {
    unit,
    attachments,
    isLoading,
    isSubmitting,
    isAttachmentDialogOpen,
    editingAttachment,
    unitForm,
    attachmentForm,
    onUnitSubmit,
    onSubmitAttachment,
    handleAttachmentDialogChange,
    handleAddNewAttachment,
    handleEditAttachment,
    handleDeleteAttachment,
    goBack,
    getStatusClass,
  } = useUnitDetails();

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  if (!unit) {
    return <div className="flex h-full w-full items-center justify-center"><p>Δεν βρέθηκε το ακίνητο.</p></div>;
  }

  return (
    <UnitDetailsPageView
      unit={unit}
      attachments={attachments}
      unitForm={unitForm}
      attachmentForm={attachmentForm}
      isSubmitting={isSubmitting}
      isAttachmentDialogOpen={isAttachmentDialogOpen}
      editingAttachment={editingAttachment}
      onUnitSubmit={onUnitSubmit}
      onSubmitAttachment={onSubmitAttachment}
      handleAttachmentDialogChange={handleAttachmentDialogChange}
      handleAddNewAttachment={handleAddNewAttachment}
      handleEditAttachment={handleEditAttachment}
      handleDeleteAttachment={handleDeleteAttachment}
      goBack={goBack}
      getStatusClass={getStatusClass}
    />
  );
}



'use client';

import { useUnitDetails } from '@/tasia/hooks/use-unit-details';
import { UnitDetailsPageView } from '@/tasia/components/units/UnitDetailsPageView';
import { Loader2 } from 'lucide-react';

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

  if (isLoading || !unit) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
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


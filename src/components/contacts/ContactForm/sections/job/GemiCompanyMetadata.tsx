'use client';

import { useWatch, type UseFormReturn } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormDescription } from '@/shared/components/ui/form';
import { Badge } from '@/shared/components/ui/badge';

interface GemiCompanyMetadataProps {
  form: UseFormReturn<any>;
}

export function GemiCompanyMetadata({ form }: GemiCompanyMetadataProps) {
    const isBranch = useWatch({ control: form.control, name: 'job.isBranch' });
    const autoRegistered = useWatch({ control: form.control, name: 'job.autoRegistered' });

    const getAutoRegisteredText = () => {
        if (typeof autoRegistered === 'boolean') {
            return autoRegistered ? 'Αυτοεγγεγραμμένη Εταιρεία' : 'Κανονική Εγγραφή (μέσω Γ.Ε.ΜΗ.)';
        }
        return '-';
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <FormItem>
                <FormLabel>Υποκατάστημα / Μητρική</FormLabel>
                <FormControl>
                    <Badge variant="outline" className="text-muted-foreground block w-fit mt-2">
                    {typeof isBranch === 'boolean' ? (isBranch ? 'Υποκατάστημα' : 'Μητρική Εταιρεία') : '-'}
                    </Badge>
                </FormControl>
                <FormDescription>Η πληροφορία αντλείται αυτόματα από το ΓΕΜΗ.</FormDescription>
            </FormItem>
            <FormItem>
                <FormLabel>Τρόπος Εγγραφής</FormLabel>
                <FormControl>
                    <Badge variant="outline" className="text-muted-foreground block w-fit mt-2">
                    {getAutoRegisteredText()}
                    </Badge>
                </FormControl>
                <FormDescription>Η πληροφορία αντλείται αυτόματα από το ΓΕΜΗ.</FormDescription>
            </FormItem>
        </div>
    );
}

'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { type ContactFormProps } from '../types';
import { AfmField } from './identity/AfmField';
import { DoyField } from './identity/DoyField';
import { IdentityTypeField } from './identity/IdentityTypeField';
import { IdentityNumberField } from './identity/IdentityNumberField';
import { IdentityIssueDateField } from './identity/IdentityIssueDateField';
import { IssuingAuthorityField } from './identity/IssuingAuthorityField';

export function IdentitySection({ form }: Pick<ContactFormProps, 'form'>) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });

    return (
        <div className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entityType === 'Φυσικό Πρόσωπο' && (
                    <>
                        <IdentityTypeField form={form} />
                        <IdentityNumberField form={form} />
                        <IdentityIssueDateField form={form} />
                        <IssuingAuthorityField form={form} />
                    </>
                )}
                <AfmField form={form} />
                <DoyField form={form} />
            </div>
        </div>
    );
}


'use client';

import React from 'react';
import type { ContactFormProps } from '../types';
import { PhoneFieldSet } from './contact/PhoneFieldSet';
import { EmailFieldSet } from './contact/EmailFieldSet';

export function ContactSection({ form }: ContactFormProps) {

    return (
        <div className="space-y-6 p-1 pt-4">
            <EmailFieldSet form={form} />
            <PhoneFieldSet form={form} />
        </div>
    );
}

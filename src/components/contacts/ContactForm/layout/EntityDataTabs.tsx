
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { GemhDataTabs } from '../tabs/GemhDataTabs';
import { UserDataTabs } from '../tabs/UserDataTabs';
import type { ContactFormProps } from '../types';

export function EntityDataTabs({ form }: Pick<ContactFormProps, 'form'>) {
    return (
        <Tabs defaultValue="gemh-data" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2">
                <TabsTrigger value="gemh-data" className="w-full">Στοιχεία από ΓΕΜΗ</TabsTrigger>
                <TabsTrigger value="user-data" className="w-full">Στοιχεία από Χρήστη</TabsTrigger>
            </TabsList>
            <TabsContent value="gemh-data" className="mt-4">
                <GemhDataTabs form={form} />
            </TabsContent>
            <TabsContent value="user-data" className="mt-4">
                <UserDataTabs form={form} />
            </TabsContent>
        </Tabs>
    );
}

"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GemhDataTabs } from "../tabs/GemhDataTabs";
import { UserDataTabs } from "../tabs/UserDataTabs";
import type { ContactFormProps } from "../types";
import { Card, CardContent } from "@/components/ui/card";

export function EntityDataTabs({ form }: Pick<ContactFormProps, "form">) {
  return (
    <Tabs defaultValue="user-data" className="w-full">
      <TabsList className="grid w-full grid-cols-3 gap-2">
        <TabsTrigger value="user-data" className="w-full">
          Στοιχεία από Χρήστη
        </TabsTrigger>
        <TabsTrigger value="gemh-data" className="w-full">
          Στοιχεία από ΓΕΜΗ
        </TabsTrigger>
        <TabsTrigger value="projects" className="w-full">
          Έργα
        </TabsTrigger>
      </TabsList>
      <TabsContent value="user-data" className="mt-4">
        <UserDataTabs form={form} />
      </TabsContent>
      <TabsContent value="gemh-data" className="mt-4">
        <GemhDataTabs form={form} />
      </TabsContent>
      <TabsContent value="projects" className="mt-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">
              Η λειτουργικότητα για την προβολή των έργων θα είναι σύντομα διαθέσιμη.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

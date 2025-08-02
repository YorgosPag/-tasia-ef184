"use client";

import { ProjectsList } from "@/components/app/projects/projects-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/app/page-layout";

// Mock data for the list during loading
const projects = [
  { id: "1", name: "3. ΕΥΤΕΡΠΗΣ" },
  { id: "2", name: "Καληαρού & Κομνηνών" },
];

function ProjectDetailsSkeleton() {
  return (
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0">
      <div className="p-2 border-b bg-background flex items-center gap-2 rounded-t-lg">
        <Skeleton className="h-5 w-48" />
      </div>
      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col h-full">
          {/* Tabs List Skeleton */}
          <div className="flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground mb-4 shrink-0">
            <div className="flex items-center">
              <Skeleton className="h-8 w-20 mx-1" />
              <Skeleton className="h-8 w-44 mx-1" />
              <Skeleton className="h-8 w-36 mx-1" />
              <Skeleton className="h-8 w-32 mx-1" />
              <Skeleton className="h-8 w-36 mx-1 bg-background" />
            </div>
          </div>

          {/* Parking Tab Skeleton */}
          <div className="border rounded-md flex flex-col h-full text-sm flex-grow">
            {/* Toolbar Skeleton */}
            <div className="p-1.5 border-b flex items-center gap-1 shrink-0">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-7 w-7" />
            </div>
            {/* Header and Filter Skeleton */}
            <div className="shrink-0">
              <div className="w-full shrink-0 border-b h-10 flex bg-muted/30 relative overflow-hidden">
                <Skeleton className="h-full flex-grow border-r" />
                <Skeleton className="h-full flex-grow border-r" />
                <Skeleton className="h-full flex-grow border-r" />
                <Skeleton className="h-full flex-grow border-r" />
                <Skeleton className="h-full flex-grow" />
              </div>
              <div className="flex w-full shrink-0 border-b bg-muted/20 items-stretch p-1 gap-1">
                <Skeleton className="h-7 flex-grow" />
                <Skeleton className="h-7 flex-grow" />
                <Skeleton className="h-7 flex-grow" />
                <Skeleton className="h-7 flex-grow" />
                <Skeleton className="h-7 flex-grow" />
              </div>
            </div>
            {/* Table Body Skeleton */}
            <div className="flex-grow overflow-auto p-2 space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            {/* Totals Skeleton */}
            <div className="p-3 border-t bg-muted/30 flex justify-between items-center shrink-0">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Loading() {
  return (
    <PageLayout>
      <ProjectsList
        projects={projects}
        selectedProject={projects[0]}
        onSelectProject={() => {}}
      />
      <ProjectDetailsSkeleton />
    </PageLayout>
  );
}

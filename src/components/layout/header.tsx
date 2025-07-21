'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 shadow-sm backdrop-blur-sm sm:h-16 sm:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex-1">
        {/* You can add a page title or breadcrumbs here */}
      </div>
    </header>
  );
}

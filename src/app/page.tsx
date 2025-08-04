"use client";

import { Loader2 } from "lucide-react";

/**
 * This is the root page.
 * It is configured to redirect to the /design-system page via next.config.js.
 * We render a loader as a fallback in case the redirect is processing.
 */
export default function RootPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}

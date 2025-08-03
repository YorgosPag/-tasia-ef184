"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/design-system");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}
